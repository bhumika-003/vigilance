# VIGILANCE Scan Verification API Contract

## Current endpoint: `POST /verify`

This endpoint accepts a typed claim, a screenshot, or both.

### Request

```http
Content-Type: application/json
```

```json
{
  "claim": "A claim to verify"
}
```

Rules:

- `claim` is required when no screenshot is sent.
- When sent, it must be a non-empty string after trimming whitespace and may contain at most 5,000 characters.

### Successful response

```json
{
  "requestId": "uuid",
  "claim": "A claim to verify",
  "inputType": "claim",
  "verdict": "unverified",
  "confidence": 0,
  "summary": "Mock response: verification services are not connected yet.",
  "sources": [],
  "status": "complete"
}
```

### Error response

All expected client errors use this shape:

```json
{
  "error": "Human-readable explanation"
}
```

## Screenshot input

Send screenshots as `multipart/form-data`:

```text
claim: optional text claim
image: optional screenshot file
```

At least one of `claim` or `image` is required. The backend accepts PNG, JPEG, and WebP images up to 5 MB, validates them before any OCR processing, and keeps them in memory only for the request. API keys and OCR calls remain server-side.

For a screenshot-only request, `claim` is an empty string and `status` is `needs_review` until OCR is added.
