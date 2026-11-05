import { z } from 'zod';

const optionalUrl = z.string().trim().max(2048).refine((value) => {
  if (!value) return true;
  try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; }
}, 'Must be a valid HTTP(S) URL');

export const settingsSectionSchema = z.enum(['general', 'seo', 'telegram', 'delivery', 'payment']);

export const generalSettingsSchema = z.object({
  storeName: z.string().trim().min(1).max(191),
  tagline: z.string().trim().max(500),
  contactEmail: z.string().trim().email().max(191),
  contactPhone: z.string().trim().min(5).max(32),
  address: z.string().trim().max(2000),
  facebookUrl: optionalUrl,
  instagramUrl: optionalUrl,
  tiktokUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  whatsappNumber: z.string().trim().max(100),
});

export const seoSettingsSchema = z.object({
  metaTitle: z.string().trim().min(1).max(191),
  metaDescription: z.string().trim().min(1).max(1000),
  metaKeywords: z.string().trim().max(1000),
  ogImage: optionalUrl,
});

export const telegramSettingsSchema = z.object({
  botToken: z.string().trim().max(512).optional(),
  chatId: z.string().trim().max(191).optional(),
  notifyOnNewOrder: z.boolean(),
});

export const deliverySettingsSchema = z.object({
  insideDhakaCharge: z.number().finite().min(0).max(1000000),
  outsideDhakaCharge: z.number().finite().min(0).max(1000000),
  freeDeliveryThreshold: z.number().finite().min(0).max(100000000),
});

export const paymentSettingsSchema = z.object({
  codEnabled: z.boolean(),
  bkashEnabled: z.boolean(),
  bkashNumber: z.string().trim().max(32),
});

export const settingsSchemas = {
  general: generalSettingsSchema,
  seo: seoSettingsSchema,
  telegram: telegramSettingsSchema,
  delivery: deliverySettingsSchema,
  payment: paymentSettingsSchema,
} as const;

export const settingsIdSchema = z.literal('singleton');
