import { z } from 'zod';
import { canonicalizeIpAddress } from '../utils/ip-address.util.js';

const reasonSchema = z.string().trim().max(2000).optional().transform((value) => value || null);

export const customerListQuerySchema = z.object({
  search: z.string().trim().max(191).optional(),
  blocked: z.enum(['true', 'false', 'all']).default('all'),
  page: z.coerce.number().int().positive().max(1_000_000).default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const customerDetailQuerySchema = z.object({
  page: z.coerce.number().int().positive().max(1_000_000).default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// Block requests need no reason; also accept an empty body from JSON clients.
export const customerBlockSchema = z.preprocess(
  (value) => value ?? {},
  z.object({ reason: reasonSchema }),
);

export const blockedIpListQuerySchema = z.object({
  status: z.enum(['active', 'all']).default('active'),
  search: z.string().trim().max(191).optional(),
  page: z.coerce.number().int().positive().max(1_000_000).default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const blockIpSchema = z.object({
  ipAddress: z.string().trim().min(1).max(100).transform((value, context) => {
    const normalized = canonicalizeIpAddress(value);
    if (!normalized) {
      context.addIssue({ code: 'custom', message: 'Enter a valid IPv4 or IPv6 address' });
      return z.NEVER;
    }
    return normalized;
  }),
  reason: reasonSchema,
});

export const customerIdSchema = z.string().trim().min(1).max(191);
export const blockedIpIdSchema = z.string().trim().min(1).max(191);
export const customerDeviceIdSchema = z.string().trim().min(1).max(191);

export type CustomerListQuery = z.infer<typeof customerListQuerySchema>;
export type CustomerDetailQuery = z.infer<typeof customerDetailQuerySchema>;
export type CustomerBlockInput = z.infer<typeof customerBlockSchema>;
export type BlockedIpListQuery = z.infer<typeof blockedIpListQuerySchema>;
export type BlockIpInput = z.infer<typeof blockIpSchema>;
