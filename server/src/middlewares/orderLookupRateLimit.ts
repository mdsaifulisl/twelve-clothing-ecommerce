import { createHash } from 'crypto';
import type { NextFunction, Request, Response } from 'express';

const WINDOW_MS = 15 * 60 * 1000;
const IP_LIMIT = 20;
const CODE_LIMIT = 5;
const MAX_TRACKED_KEYS = 10_000;

interface RateBucket {
  count: number;
  resetAt: number;
}

const attempts = new Map<string, RateBucket>();

const increment = (key: string, now: number, limit: number): number | null => {
  let bucket = attempts.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + WINDOW_MS };
    attempts.set(key, bucket);
  }

  if (bucket.count >= limit) return Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
  bucket.count += 1;
  return null;
};

export const orderLookupRateLimit = (req: Request, res: Response, next: NextFunction) => {
  const now = Date.now();
  for (const [key, bucket] of attempts) {
    if (bucket.resetAt <= now) attempts.delete(key);
  }

  if (attempts.size > MAX_TRACKED_KEYS) {
    const oldestKeys = [...attempts.entries()]
      .sort((a, b) => a[1].resetAt - b[1].resetAt)
      .slice(0, attempts.size - MAX_TRACKED_KEYS);
    for (const [key] of oldestKeys) attempts.delete(key);
  }

  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const suppliedCode = typeof req.body?.orderCode === 'string'
    ? req.body.orderCode.trim().toUpperCase()
    : '';
  const codeKey = createHash('sha256').update(suppliedCode).digest('hex');
  const ipRetryAfter = increment(`ip:${ip}`, now, IP_LIMIT);
  const codeRetryAfter = increment(`ip-code:${ip}:${codeKey}`, now, CODE_LIMIT);
  const retryAfter = ipRetryAfter ?? codeRetryAfter;

  if (retryAfter !== null) {
    res.setHeader('Retry-After', String(retryAfter));
    return res.status(429).json({
      success: false,
      message: 'Too many lookup attempts. Please try again later.',
      retryAfterSeconds: retryAfter,
    });
  }

  return next();
};

/** Exposed for deterministic unit tests; not used to clear runtime state. */
export const resetOrderLookupRateLimitForTests = () => attempts.clear();
