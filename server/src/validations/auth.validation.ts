import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  phone: z.string().optional(),
  role: z.enum(['moderator', 'admin']).optional(),
});

export const loginSchema = z.object({
  emailOrPhone: z.string().min(1, { message: 'Email or phone number is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export const forgotPasswordSchema = z.object({
  emailOrPhone: z.string().min(1, { message: 'Email or phone number is required' }),
});

export const verifyOtpSchema = z.object({
  emailOrPhone: z.string().min(1, { message: 'Email or phone number is required' }),
  otp: z.string().length(6, { message: 'OTP must be exactly 6 digits' }),
});

export const resetPasswordSchema = z.object({
  emailOrPhone: z.string().min(1, { message: 'Email or phone number is required' }),
  otp: z.string().length(6, { message: 'OTP must be exactly 6 digits' }),
  newPassword: z.string().min(6, { message: 'New password must be at least 6 characters long' }),
});