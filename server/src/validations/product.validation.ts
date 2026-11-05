import { z } from 'zod';

export const createProductSchema = z.object({
  title: z.string().min(1, 'Product title is required'),
  price: z.preprocess(
    (val) => Number(val),
    z.number({ message: 'Price must be a valid number' }).positive('Price must be positive')
  ),
  discount: z.preprocess(
    (val) => Number(val),
    z.number({ message: 'Discount must be a valid number' })
      .min(0, 'Discount cannot be negative')
      .max(100, 'Discount cannot exceed 100')
      .default(0)
  ),
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().min(1, 'SubCategory is required'),
  productType: z.string().min(1, 'ProductType is required'),
  color: z.string().optional(),
  availableSizes: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return [];
        }
      }
      return val;
    },
    z.array(z.string()).default([])
  ),
  description: z.string().optional(),
  material: z.string().optional(),
  fit: z.string().optional(),
  careInstructions: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return [];
        }
      }
      return val;
    },
    z.array(z.string()).default([])
  ),
  sku: z.string().optional(),
  
  // 🚀 অত্যন্ত গুরুত্বপূর্ণ: এখানে existingImages স্কিমা যুক্ত করা হলো যাতে Zod এটিকে রিমুভ না করে
  existingImages: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          return [val];
        }
      }
      if (Array.isArray(val)) return val;
      return val ? [val] : [];
    },
    z.array(z.string()).optional()
  ),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;