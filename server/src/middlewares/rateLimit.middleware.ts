import type { Request } from 'express';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';

const hasValidToken = (req: Request): boolean => {
  const secret = process.env.JWT_SECRET;
  if (!secret) return false;

  const token =
    req.cookies?.accessToken ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : undefined);

  if (!token) return false;

  try {
    jwt.verify(token, secret);
    return true;
  } catch {
    return false;
  }
};

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // ১৫ মিনিট
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // ১ মিনিট
  max: 120,
  skip: (req: Request) => hasValidToken(req),
  standardHeaders: true,
  legacyHeaders: false,
});