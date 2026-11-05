import { z } from 'zod';

const imageValue = (required: boolean) => z.preprocess(
  (value) => Array.isArray(value) ? value[0] : value,
  required
    ? z.string().trim().min(1, 'Banner image is required')
    : z.string().trim().min(1, 'Banner image cannot be empty').optional(),
);

const linkSchema = z.string().trim().min(1).max(2048).refine(
  (value) => value.startsWith('/') && !value.startsWith('//') && !value.includes('\\'),
  'Link must be an internal path starting with /',
);

export const createSliderSchema = z.object({
  title: z.string().trim().min(1, 'Slide title is required').max(191),
  subtitle: z.string().trim().max(1000).optional().default(''),
  buttonText: z.string().trim().max(100).optional().default('SHOP NOW'),
  link: linkSchema.optional().default('/shop'),
  image: imageValue(true),
});

export const updateSliderSchema = z.object({
  title: z.string().trim().min(1).max(191).optional(),
  subtitle: z.string().trim().max(1000).optional(),
  buttonText: z.string().trim().max(100).optional(),
  link: linkSchema.optional(),
  image: imageValue(false).optional(),
}).refine((value) => Object.keys(value).length > 0, 'At least one slider field must be provided');

export const sliderIdSchema = z.string().uuid('Invalid slider id');

export type CreateSliderInput = z.infer<typeof createSliderSchema>;
export type UpdateSliderInput = z.infer<typeof updateSliderSchema>;
