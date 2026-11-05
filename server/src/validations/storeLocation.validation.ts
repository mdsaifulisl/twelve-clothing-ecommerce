import { z } from 'zod';

const mapLinkSchema = z.preprocess(
  (value) => typeof value === 'string' && value.trim() === '' ? '#' : value,
  z.string().trim().max(2048).refine((value) => {
    if (value === '#') return true;
    try {
      return new URL(value).protocol === 'https:';
    } catch {
      return false;
    }
  }, 'Map link must be an HTTPS URL'),
);

export const createStoreLocationSchema = z.object({
  division: z.string().trim().min(1).max(100).optional().default('Dhaka Division'),
  name: z.string().trim().min(1, 'Outlet name is required').max(191),
  address: z.string().trim().min(1, 'Address is required').max(10000),
  phone: z.string().trim().min(7).max(32).regex(/^[+0-9][0-9\s().-]*$/, 'Phone number contains invalid characters'),
  offDay: z.string().trim().min(1).max(50).optional().default('Sunday'),
  openingTime: z.string().trim().min(1).max(50).optional().default('10:00 AM'),
  closingTime: z.string().trim().min(1).max(50).optional().default('10:00 PM'),
  mapLink: mapLinkSchema.optional().default('#'),
});

export const storeLocationIdSchema = z.string().uuid('Invalid store location id');

export type CreateStoreLocationInput = z.infer<typeof createStoreLocationSchema>;
