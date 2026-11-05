import { z } from 'zod';
import { OrderCity, OrderPaymentMethod, OrderStatus } from '@prisma/client';
import { normalizeBangladeshPhone } from '../utils/phone.util.js';

const orderCodeSchema = z.string()
  .trim()
  .toUpperCase()
  .regex(/^RK-[0-9A-F]{24}$/, 'Invalid order code');

const phoneSchema = z.string()
  .trim()
  .min(1, 'Phone number is required')
  .transform((value, context) => {
    const normalized = normalizeBangladeshPhone(value);
    if (!normalized) {
      context.addIssue({ code: 'custom', message: 'Enter a valid Bangladesh mobile number' });
      return z.NEVER;
    }
    return normalized;
  });

const orderItemSchema = z.object({
  productId: z.string().trim().min(1).max(191),
  size: z.string().trim().min(1).max(32),
  color: z.string().trim().max(191).nullable().optional().transform((value) => value ?? ''),
  quantity: z.number().int().positive().max(1000),
});

export const createOrderSchema = z.object({
  customerName: z.string().trim().min(1).max(191, 'name must be less than 191 characters'),
  phone: phoneSchema,
  address: z.string().trim().min(1).max(5000, 'Address must be less than 5000 characters'),
  city: z.nativeEnum(OrderCity),
  paymentMethod: z.nativeEnum(OrderPaymentMethod),
  deviceId: z.string().uuid().optional(),
  items: z.array(orderItemSchema).min(1).max(100),
}).transform(({ phone, ...order }) => ({
  ...order,
  phone: phone.phone,
  normalizedPhone: phone.normalizedPhone,
}));

export const orderLookupSchema = z.object({
  orderCode: orderCodeSchema,
  phone: phoneSchema,
}).transform(({ phone, orderCode }) => ({
  orderCode,
  normalizedPhone: phone.normalizedPhone,
}));

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export const archiveOrderSchema = z.object({
  archived: z.boolean(),
});

export const ordersQuerySchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  search: z.string().trim().max(191).optional(),
  page: z.coerce.number().int().positive().max(1_000_000).default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  archived: z.enum(['true', 'false', 'all']).default('false'),
});

export const orderIdSchema = z.string().trim().min(1).max(191);

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderLookupInput = z.infer<typeof orderLookupSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type ArchiveOrderInput = z.infer<typeof archiveOrderSchema>;
export type OrdersQuery = z.infer<typeof ordersQuerySchema>;
