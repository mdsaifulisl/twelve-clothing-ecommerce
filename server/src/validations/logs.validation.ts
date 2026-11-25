import { z } from 'zod';

export const createActivityLogSchema = z.object({
  body: z.object({
    userName: z.string().min(1, 'User name is required'),
    userRole: z.enum(['Admin', 'Moderator', 'Editor', 'Support'], {
      error: 'Invalid user role',
    }),
    action: z.string().min(1, 'Action is required'),
    module: z.enum(['Orders', 'Products', 'Customers', 'Sliders', 'Team'], {
      error: 'Invalid module name',
    }),
    details: z.string().min(1, 'Details are required'),
    ipAddress: z.string().optional(),
  }),
}); 