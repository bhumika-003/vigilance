import assert from 'node:assert/strict';
import { createServer, type Server } from 'node:http';
import { after, before, test } from 'node:test';

import { app } from '../src/app.js';

let server: Server;
let baseUrl: string;

before(async () => {
  server = createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });

  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test('GET /health returns an ok status', async () => {
  const response = await fetch(`${baseUrl}/health`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('POST /verify returns the mock verification contract', async () => {
  const response = await fetch(`${baseUrl}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ claim: 'The Earth is flat.' }),
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.claim, 'The Earth is flat.');
  assert.equal(body.inputType, 'claim');
  assert.equal(body.verdict, 'unverified');
  assert.equal(body.confidence, 0);
  assert.equal(body.status, 'complete');
  assert.deepEqual(body.sources, []);
  assert.equal(typeof body.requestId, 'string');
});

test('POST /verify accepts a screenshot-only request without storing the file', async () => {
  const form = new FormData();
  form.set('image', new Blob(['not a real image'], { type: 'image/png' }), 'claim.png');

  const response = await fetch(`${baseUrl}/verify`, {
    method: 'POST',
    body: form,
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.claim, '');
  assert.equal(body.inputType, 'screenshot');
  assert.equal(body.status, 'needs_review');
  assert.equal(body.summary, 'Mock response: screenshot accepted; OCR is not connected yet.');
});

test('POST /verify rejects an unsupported screenshot type', async () => {
  const form = new FormData();
  form.set('image', new Blob(['plain text'], { type: 'text/plain' }), 'notes.txt');

  const response = await fetch(`${baseUrl}/verify`, {
    method: 'POST',
    body: form,
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: 'Only PNG, JPEG, and WebP images are supported.',
  });
});

test('POST /verify rejects an oversized screenshot', async () => {
  const form = new FormData();
  form.set(
    'image',
    new Blob([new Uint8Array(5 * 1024 * 1024 + 1)], { type: 'image/png' }),
    'too-large.png',
  );

  const response = await fetch(`${baseUrl}/verify`, {
    method: 'POST',
    body: form,
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'Image files must be 5 MB or smaller.' });
});

test('POST /verify rejects a request without a claim', async () => {
  const response = await fetch(`${baseUrl}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: 'The request body must include a non-empty "claim" string.',
  });
});

test('POST /verify rejects an overly long claim', async () => {
  const response = await fetch(`${baseUrl}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ claim: 'a'.repeat(5_001) }),
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: 'The "claim" must be 5000 characters or fewer.',
  });
});

test('POST /verify rejects malformed JSON with a JSON error response', async () => {
  const response = await fetch(`${baseUrl}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{',
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: 'The request body must contain valid JSON.',
  });
});

test('unknown routes return a JSON error response', async () => {
  const response = await fetch(`${baseUrl}/unknown-route`);

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: 'Route not found.' });
});
