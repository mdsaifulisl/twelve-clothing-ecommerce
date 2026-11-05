import { z } from 'zod';

const sectionSchema = z.object({
  heading: z.string().trim().min(1).max(191),
  body: z.string().trim().min(1).max(20000),
});

export const updateTermsPageSchema = z.object({
  title: z.string().trim().min(1).max(191),
  introduction: z.string().trim().min(1).max(20000),
  effectiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Effective date must use YYYY-MM-DD format').refine((value) => {
    const parsed = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }, 'Effective date must be a valid calendar date'),
  sections: z.array(sectionSchema).min(1).max(40),
});

export type UpdateTermsPageInput = z.infer<typeof updateTermsPageSchema>;
