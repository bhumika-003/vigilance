import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import express, {
  type Request,
  type Response,
} from 'express';

import multer, {
  MulterError,
} from 'multer';

import {
  MAX_CLAIM_LENGTH,
  MAX_IMAGE_SIZE_BYTES,
  type ErrorResponse,
  type HealthResponse,
  type VerifyRequestBody,
  type VerifyResponse,
  type VerificationSource,
} from './contracts.js';
// scanAnalysisService.js is CommonJS
const { analyzeScan } = require(
  './services/scanAnalysisService.js',
);

export const app = express();

const allowedImageMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

class UnsupportedImageTypeError extends Error {
  constructor() {
    super(
      'Only PNG, JPEG, and WebP images are supported.',
    );
  }
}

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: MAX_IMAGE_SIZE_BYTES,
    files: 1,
  },

  fileFilter: (_request, file, callback) => {
    if (
      !allowedImageMimeTypes.has(
        file.mimetype,
      )
    ) {
      callback(
        new UnsupportedImageTypeError(),
      );
      return;
    }

    callback(null, true);
  },
});

app.use(express.json());

/**
 * ---------------------------------------------
 * HEALTH CHECK
 * ---------------------------------------------
 */

app.get(
  '/health',
  (
    _request: Request,
    response: Response<HealthResponse>,
  ) => {
    return response.status(200).json({
      status: 'ok',
    });
  },
);

/**
 * ---------------------------------------------
 * VERIFY
 * ---------------------------------------------
 *
 * Screenshot
 *     ↓
 * Temporary file
 *     ↓
 * OCR
 *     ↓
 * Claim extraction
 *     ↓
 * Fact checking
 *     ↓
 * Individual verdicts
 *     ↓
 * Overall verdict
 */

app.post(
  '/verify',
  upload.single('image'),

  async (
    request: Request<
      {},
      VerifyResponse | ErrorResponse,
      VerifyRequestBody
    >,

    response: Response<
      VerifyResponse | ErrorResponse
    >,
  ) => {
    const claim = request.body?.claim;

    const normalizedClaim =
      typeof claim === 'string'
        ? claim.trim()
        : '';

    const hasImage =
      Boolean(request.file);

    /**
     * ---------------------------------------------
     * Validate claim
     * ---------------------------------------------
     */

    if (
      claim !== undefined &&
      typeof claim !== 'string'
    ) {
      return response.status(400).json({
        error:
          'The request body must include a non-empty "claim" string.',
      });
    }

    /**
     * At least an image or claim must exist.
     */

    if (
      !hasImage &&
      normalizedClaim.length === 0
    ) {
      return response.status(400).json({
        error:
          'The request body must include a non-empty "claim" string.',
      });
    }

    /**
     * Validate claim length.
     */

    if (
      normalizedClaim.length >
      MAX_CLAIM_LENGTH
    ) {
      return response.status(400).json({
        error: `The "claim" must be ${MAX_CLAIM_LENGTH} characters or fewer.`,
      });
    }

    /**
     * Currently the full scan requires
     * an image.
     */

    if (!request.file) {
      return response.status(400).json({
        error:
          'Please upload an image using the "image" field.',
      });
    }

    const requestId = randomUUID();

    /**
     * ---------------------------------------------
     * Temporary image path
     * ---------------------------------------------
     */

    const extension =
      path.extname(
        request.file.originalname,
      ) ||
      (
        request.file.mimetype ===
        'image/png'
          ? '.png'
          : request.file.mimetype ===
              'image/webp'
            ? '.webp'
            : '.jpg'
      );

    const tempFilePath =
      path.join(
        os.tmpdir(),
        `vigilance-${requestId}${extension}`,
      );

    try {
      console.log(
        `\n[${requestId}] Starting scan...`,
      );

      /**
       * Save uploaded image temporarily.
       */

      await fs.writeFile(
        tempFilePath,
        request.file.buffer,
      );

      console.log(
        `[${requestId}] Image saved temporarily.`,
      );

      console.log(
        `[${requestId}] Running scan pipeline...`,
      );

      /**
       * ---------------------------------------------
       * RUN PIPELINE
       * ---------------------------------------------
       *
       * OCR
       * ↓
       * claim extraction
       * ↓
       * fact checking
       * ↓
       * individual verdicts
       */

      const scanResult =
        await analyzeScan(
          tempFilePath,
        );

      console.log(
        `[${requestId}] Scan completed.`,
      );

      /**
       * ---------------------------------------------
       * CLAIMS
       * ---------------------------------------------
       */

      const claims =
        Array.isArray(
          scanResult?.claims,
        )
          ? scanResult.claims
          : [];

      /**
       * ---------------------------------------------
       * EXTRACT VERDICTS
       * ---------------------------------------------
       *
       * Supports both:
       *
       * verdict: "TRUE"
       *
       * and:
       *
       * verdict: {
       *   verdict: "TRUE",
       *   confidence: 0.95
       * }
       */

      const verdicts =
        claims
          .map(
            (claimResult: any) => {
              /**
               * Case 1:
               * verdict is a string.
               */

              if (
                typeof claimResult?.verdict ===
                'string'
              ) {
                return claimResult.verdict;
              }

              /**
               * Case 2:
               * verdict is an object.
               */

              if (
                claimResult?.verdict &&
                typeof
                  claimResult.verdict
                    .verdict ===
                    'string'
              ) {
                return (
                  claimResult.verdict
                    .verdict
                );
              }

              return null;
            },
          )
          .filter(
            (
              value: string | null,
            ): value is string =>
              value !== null,
          );

      /**
       * ---------------------------------------------
       * OVERALL VERDICT
       * ---------------------------------------------
       */

      let overallVerdict =
        'unverified';

      if (
        verdicts.length > 0
      ) {
        const normalizedVerdicts =
          verdicts.map(
            (value: string) =>
              value
                .toLowerCase()
                .trim(),
          );

        const allTrue =
          normalizedVerdicts.every(
            (value: string) =>
              value === 'true',
          );

        const allFalse =
          normalizedVerdicts.every(
            (value: string) =>
              value === 'false',
          );

        const allUnverifiable =
          normalizedVerdicts.every(
            (value: string) =>
              value ===
                'unverifiable' ||
              value ===
                'unverified',
          );

        if (allTrue) {
          overallVerdict =
            'true';
        } else if (allFalse) {
          overallVerdict =
            'false';
        } else if (
          allUnverifiable
        ) {
          overallVerdict =
            'unverified';
        } else {
          overallVerdict =
            'mixed';
        }
      }

      /**
       * ---------------------------------------------
       * OVERALL CONFIDENCE
       * ---------------------------------------------
       */

      const confidences =
        claims
          .map(
            (claimResult: any) => {
              if (
                claimResult?.verdict &&
                typeof
                  claimResult
                    .verdict
                    .confidence ===
                    'number'
              ) {
                return Number(
                  claimResult
                    .verdict
                    .confidence,
                );
              }

              return null;
            },
          )
          .filter(
            (
              value: number | null,
            ): value is number =>
              value !== null &&
              Number.isFinite(value),
          );

      let overallConfidence =
        0;

      if (
        confidences.length > 0
      ) {
        overallConfidence =
          confidences.reduce(
            (
              sum: number,
              value: number,
            ) =>
              sum + value,
            0,
          ) /
          confidences.length;
      }

      /**
       * Keep confidence between 0 and 1.
       */

      overallConfidence =
        Math.max(
          0,
          Math.min(
            1,
            overallConfidence,
          ),
        );

      /**
       * ---------------------------------------------
       * SUPPORTING SOURCES
       * ---------------------------------------------
       */

const sources: VerificationSource[] = [];

for (const claimResult of claims) {
  const supportingSources =
    claimResult?.verdict?.supportingSources;

  if (!Array.isArray(supportingSources)) {
    continue;
  }

  for (const source of supportingSources) {
    /**
     * New format:
     *
     * {
     *   title: "...",
     *   url: "...",
     *   publisher: "..."
     * }
     */
    if (
      source &&
      typeof source === 'object' &&
      typeof source.url === 'string'
    ) {
      const verificationSource: VerificationSource = {
        title:
          typeof source.title === 'string'
            ? source.title
            : source.url,

        url: source.url,

        ...(typeof source.publisher === 'string'
          ? { publisher: source.publisher }
          : {}),

        ...(typeof source.rating === 'string'
          ? { rating: source.rating }
          : {}),

        ...(typeof source.publishedAt === 'string'
          ? { publishedAt: source.publishedAt }
          : {}),
      };

      if (
        !sources.some(
          (existing) =>
            existing.url === verificationSource.url,
        )
      ) {
        sources.push(verificationSource);
      }

      continue;
    }

    /**
     * Older pipeline format:
     *
     * "https://example.com/article"
     *
     * Convert it into the format expected by
     * VerificationSource.
     */
    if (typeof source === 'string') {
      const verificationSource: VerificationSource = {
        title: source,
        url: source,
      };

      if (
        !sources.some(
          (existing) =>
            existing.url === verificationSource.url,
        )
      ) {
        sources.push(verificationSource);
      }
    }
  }
}
      /**
       * ---------------------------------------------
       * SUMMARY
       * ---------------------------------------------
       */

      let summary =
        'Scan completed successfully.';

      if (
        overallVerdict ===
        'true'
      ) {
        summary =
          'The available evidence supports the claims in this screenshot.';
      } else if (
        overallVerdict ===
        'false'
      ) {
        summary =
          'The available evidence does not support the claims in this screenshot.';
      } else if (
        overallVerdict ===
        'mixed'
      ) {
        summary =
          'The screenshot contains claims with mixed evidence.';
      } else {
        summary =
          'The claims could not be sufficiently verified.';
      }

      /**
       * ---------------------------------------------
       * FINAL RESPONSE
       * ---------------------------------------------
       *
       * "scan" is intentionally included while
       * we are developing the frontend.
       */

      return response.status(200).json({
        requestId,

        claim:
          normalizedClaim,

        inputType:
          'screenshot',

        verdict:
          overallVerdict,

        confidence:
          overallConfidence,

        summary,

        sources,

        status:
          'complete',

        scan:
          scanResult,
      } as VerifyResponse);
    } catch (error) {
      /**
       * ---------------------------------------------
       * PIPELINE ERROR
       * ---------------------------------------------
       */

      console.error(
        `[${requestId}] Scan failed:`,
        error,
      );

      return response.status(500).json({
        error:
          'The scan pipeline failed.',
      });
    } finally {
      /**
       * ---------------------------------------------
       * CLEANUP
       * ---------------------------------------------
       *
       * Always delete temporary image.
       */

      try {
        await fs.unlink(
          tempFilePath,
        );
      } catch {
        // File may already have been removed.
      }
    }
  },
);

/**
 * ---------------------------------------------
 * 404 HANDLER
 * ---------------------------------------------
 */

app.use(
  (
    _request: Request,
    response: Response<ErrorResponse>,
  ) => {
    return response.status(404).json({
      error:
        'Route not found.',
    });
  },
);

/**
 * ---------------------------------------------
 * GLOBAL ERROR HANDLER
 * ---------------------------------------------
 */

app.use(
  (
    error: unknown,
    _request: Request,
    response: Response<ErrorResponse>,
    next: (
      error: unknown,
    ) => void,
  ) => {
    /**
     * Malformed JSON
     */

    const isMalformedJson =
      error instanceof
        SyntaxError &&
      (
        error as
          SyntaxError & {
            type?: string;
          }
      ).type ===
        'entity.parse.failed';

    if (
      isMalformedJson
    ) {
      return response
        .status(400)
        .json({
          error:
            'The request body must contain valid JSON.',
        });
    }

    /**
     * Unsupported image type
     */

    if (
      error instanceof
      UnsupportedImageTypeError
    ) {
      return response
        .status(400)
        .json({
          error:
            error.message,
        });
    }

    /**
     * Multer errors
     */

    if (
      error instanceof
      MulterError
    ) {
      if (
        error.code ===
        'LIMIT_FILE_SIZE'
      ) {
        return response
          .status(400)
          .json({
            error:
              'Image files must be 5 MB or smaller.',
          });
      }

      if (
        error.code ===
        'LIMIT_UNEXPECTED_FILE'
      ) {
        return response
          .status(400)
          .json({
            error:
              'Use the "image" field for a screenshot upload.',
          });
      }
    }

    /**
     * Pass unexpected errors
     * to the next Express handler.
     */

    return next(error);
  },
);