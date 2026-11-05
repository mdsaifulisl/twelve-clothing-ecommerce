import assert from 'node:assert/strict';
import test from 'node:test';
import type { NextFunction, Request, Response } from 'express';
import { orderLookupRateLimit, resetOrderLookupRateLimitForTests } from './orderLookupRateLimit.js';

const invoke = (ip: string, orderCode: string) => {
  let statusCode = 200;
  let payload: unknown;
  let retryAfter: string | undefined;
  let didNext = false;

  const req = { ip, body: { orderCode }, socket: { remoteAddress: ip } } as unknown as Request;
  const res = {
    setHeader: (name: string, value: string) => { if (name === 'Retry-After') retryAfter = value; },
    status: (value: number) => {
      statusCode = value;
      return { json: (body: unknown) => { payload = body; } };
    },
  } as unknown as Response;
  const next = (() => { didNext = true; }) as NextFunction;

  orderLookupRateLimit(req, res, next);
  return { statusCode, payload, retryAfter, didNext };
};

test('limits repeated lookup attempts for the same IP and hashed order code', () => {
  resetOrderLookupRateLimitForTests();
  const code = 'RK-0123456789ABCDEF01234567';

  for (let attempt = 0; attempt < 5; attempt += 1) {
    assert.equal(invoke('203.0.113.10', code).didNext, true);
  }

  const limited = invoke('203.0.113.10', code);
  assert.equal(limited.statusCode, 429);
  assert.equal(limited.didNext, false);
  assert.ok(limited.retryAfter);
  assert.deepEqual(limited.payload, {
    success: false,
    message: 'Too many lookup attempts. Please try again later.',
    retryAfterSeconds: Number(limited.retryAfter),
  });

  resetOrderLookupRateLimitForTests();
});
