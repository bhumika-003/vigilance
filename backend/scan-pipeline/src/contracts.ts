export type Verdict = 'verified' | 'misleading' | 'false' | 'unverified';

export type VerificationStatus = 'complete' | 'needs_review';

export type VerificationInputType = 'claim' | 'screenshot' | 'claim_and_screenshot';

export type VerificationSource = {
  title: string;
  url: string;
  publisher?: string;
  rating?: string;
  publishedAt?: string;
};

export type VerifyRequestBody = {
  claim?: unknown;
};

export const MAX_CLAIM_LENGTH = 5_000;

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export type VerifyResponse = {
  requestId: string;
  claim: string;
  inputType: VerificationInputType;
  verdict: Verdict;
  confidence: number;
  summary: string;
  sources: VerificationSource[];
  status: VerificationStatus;
};

export type ErrorResponse = {
  error: string;
};

export type HealthResponse = {
  status: 'ok';
};
