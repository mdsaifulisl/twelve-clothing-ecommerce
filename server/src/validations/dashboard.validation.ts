import { z } from 'zod';

export const dashboardQuerySchema = z.object({
  period: z.enum(['daily', 'weekly', 'monthly']).default('monthly'),
});

export type DashboardPeriod = z.infer<typeof dashboardQuerySchema>['period'];
