import { z } from 'zod';

const internalLinkSchema = z.string().trim().min(1).max(2048).refine(
  (value) => value.startsWith('/') && !value.startsWith('//') && !value.includes('\\'),
  'Button link must be an internal path starting with /',
);

const optionalImageSchema = z.preprocess(
  (value) => Array.isArray(value) ? value[0] : value,
  z.string().trim().min(1).max(2048).refine((value) => {
    if (value.startsWith('/uploads/about/')) return true;
    try {
      const protocol = new URL(value).protocol;
      return protocol === 'https:' || protocol === 'http:';
    } catch {
      return false;
    }
  }, 'Image must be an uploaded image path or HTTP(S) URL').optional(),
);

export const updateAboutSectionSchema = z.object({
  title: z.string().trim().min(1, 'Main heading is required').max(191),
  paragraph1: z.string().trim().min(1, 'Paragraph 1 is required').max(20000),
  paragraph2: z.string().trim().max(20000).optional().default(''),
  buttonText: z.string().trim().max(100).optional().default(''),
  buttonLink: internalLinkSchema,
  image: optionalImageSchema,
});

export type UpdateAboutSectionInput = z.infer<typeof updateAboutSectionSchema>;
