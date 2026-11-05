import { z } from 'zod';

const faqItemSchema = z.object({
  category: z.string().trim().min(1).max(80),
  question: z.string().trim().min(1).max(250),
  answer: z.string().trim().min(1).max(5000),
});

export const updateFaqPageSchema = z.object({
  items: z.array(faqItemSchema).min(1).max(100),
});

export type UpdateFaqPageInput = z.infer<typeof updateFaqPageSchema>;
