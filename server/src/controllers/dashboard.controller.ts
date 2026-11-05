import type { Request, Response } from 'express';
import { getDashboardSummary } from '../services/dashboard.service.js';
import { dashboardQuerySchema } from '../validations/dashboard.validation.js';
import { AppError } from '../utils/AppError.js';

export const getDashboardSummaryHandler = async (req: Request, res: Response) => {
  const parsed = dashboardQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    throw new AppError('Validation failed', 400, parsed.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    })));
  }
  const data = await getDashboardSummary(parsed.data.period);
  return res.status(200).json({ success: true, data });
};
