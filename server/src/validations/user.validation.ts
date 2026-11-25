
import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});


export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  role: z.enum(['admin', 'moderator', 'seller']).default('moderator'),
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Please enter a valid email address').optional(),
  phone: z.string().optional(),
  role: z.enum(['admin', 'moderator', 'seller']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
    otp: z.string().length(6, 'OTP must be 6 digits'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
    otp: z.string().length(6, 'OTP must be 6 digits'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters long'),
  }),
});