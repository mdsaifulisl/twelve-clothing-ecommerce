import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  name?: string;
  email: string;
  role: string;
}

// Extend the Express Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authGuard = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Extract token from cookies or Authorization header
      let token = req.cookies?.accessToken;

      if (!token && req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
      }

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'You are not authorized to access this resource. Please log in.',
        });
      }

      // 2. Verify the token
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET is not configured in environment variables.');
      }

      const decoded = jwt.verify(token, secret) as JwtPayload;

      // 3. Attach decoded user info to the request object
      req.user = decoded;

      // 4. Role-Based Access Control (RBAC) check
      if (requiredRoles.length > 0 && !requiredRoles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You do not have permission to perform this action.',
        });
      }

      next();
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please log in again.',
      });
    }
  };
};