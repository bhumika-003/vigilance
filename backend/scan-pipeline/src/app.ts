import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import express, { type Request, type Response } from 'express';
import multer, { MulterError } from 'multer';

import {
  MAX_CLAIM_LENGTH,
  MAX_IMAGE_SIZE_BYTES,
  type ErrorResponse,
  type HealthResponse,
  type VerifyRequestBody,
  type VerifyResponse,
} from './contracts.js';

// scanAnalysisService.js is CommonJS
const { analyzeScan } = require('./services/scanAnalysisService.js');

export const app = express();

const allowedImageMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

class UnsupportedImageTypeError extends Error {
  constructor() {
    super('Only PNG, JPEG, and WebP images are supported.');
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_IMAGE_SIZE_BYTES,
    files: 1,
  },
  fileFilter: (_request, file, callback) => {
    if (!allowedImageMimeTypes.has(file.mimetype)) {
      callback(new UnsupportedImageTypeError());
      return;
    }

    callback(null, true);
  },
});

app.use(express.json());

app.get(
  '/health',
  (_request: Request, response: Response<HealthResponse>) => {
    return response.status(200).json({ status: 'ok' });
  },
);

app.post(
  '/verify',
  upload.single('image'),
  async (
    request: Request<{}, VerifyResponse | ErrorResponse, VerifyRequestBody>,
    response: Response<VerifyResponse | ErrorResponse>,
  ) => {
    const claim = request.body?.claim;
    const normalizedClaim =
      typeof claim === 'string' ? claim.trim() : '';

    const hasImage = Boolean(request.file);

    if (claim !== undefined && typeof claim !== 'string') {
      return response.status(400).json({
        error: 'The request body must include a non-empty "claim" string.',
      });
    }

    if (!hasImage && normalizedClaim.length === 0) {
      return response.status(400).json({
        error: 'The request body must include a non-empty "claim" string.',
      });
    }

    if (normalizedClaim.length > MAX_CLAIM_LENGTH) {
      return response.status(400).json({
        error: `The "claim" must be ${MAX_CLAIM_LENGTH} characters or fewer.`,
      });
    }

    // For now, the full AI scan requires an image.
    if (!request.file) {
      return response.status(400).json({
        error: 'Please upload an image using the "image" field.',
      });
    }

    const requestId = randomUUID();

    // Preserve the original file extension.
    const extension =
      path.extname(request.file.originalname) ||
      (request.file.mimetype === 'image/png'
        ? '.png'
        : request.file.mimetype === 'image/webp'
          ? '.webp'
          : '.jpg');

    const tempFilePath = path.join(
      os.tmpdir(),
      `vigilance-${requestId}${extension}`,
    );

    try {
      console.log(`\n[${requestId}] Starting scan...`);

      // Save uploaded image temporarily because analyzeScan()
      // expects a file path.
      await fs.writeFile(tempFilePath, request.file.buffer);

      console.log(`[${requestId}] Image saved temporarily.`);
      console.log(`[${requestId}] Running scan pipeline...`);

      // OCR → claim extraction → fact checking → verdict
      const scanResult = await analyzeScan(tempFilePath);

      console.log(`[${requestId}] Scan completed.`);

      return response.status(200).json({
        requestId,
        claim: normalizedClaim,
        inputType: 'screenshot',
        verdict: 'unverified',
        confidence: 0,
        summary: 'Scan completed successfully.',
        sources: [],
        status: 'complete',

        // Actual pipeline result
        scan: scanResult,
      } as VerifyResponse);
    } catch (error) {
      console.error(`[${requestId}] Scan failed:`, error);

      return response.status(500).json({
        error: 'The scan pipeline failed.',
      });
    } finally {
      // Always remove the temporary image.
      try {
        await fs.unlink(tempFilePath);
      } catch {
        // File may already have been removed.
      }
    }
  },
);

app.use(
  (_request: Request, response: Response<ErrorResponse>) => {
    return response.status(404).json({
      error: 'Route not found.',
    });
  },
);

app.use(
  (
    error: unknown,
    _request: Request,
    response: Response<ErrorResponse>,
    next: (error: unknown) => void,
  ) => {
    const isMalformedJson =
      error instanceof SyntaxError &&
      (error as SyntaxError & { type?: string }).type ===
        'entity.parse.failed';

    if (isMalformedJson) {
      return response.status(400).json({
        error: 'The request body must contain valid JSON.',
      });
    }

    if (error instanceof UnsupportedImageTypeError) {
      return response.status(400).json({
        error: error.message,
      });
    }

    if (error instanceof MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return response.status(400).json({
          error: 'Image files must be 5 MB or smaller.',
        });
      }

      if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        return response.status(400).json({
          error: 'Use the "image" field for a screenshot upload.',
        });
      }
    }

    void next;

    return response.status(500).json({
      error: 'Unexpected server error.',
    });
  },
);