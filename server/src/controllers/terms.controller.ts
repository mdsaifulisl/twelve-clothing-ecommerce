import type { Request, Response } from 'express';
import { getTermsPage, updateTermsPage } from '../services/terms.service.js';
import type { UpdateTermsPageInput } from '../validations/terms.validation.js';

export const getTermsPageHandler = async (_req: Request, res: Response) => {
  const data = await getTermsPage();
  return res.status(200).json({ success: true, data });
};

export const updateTermsPageHandler = async (req: Request, res: Response) => {
  const data = await updateTermsPage(req.body as UpdateTermsPageInput);
  return res.status(200).json({ success: true, message: 'Terms page updated successfully', data });
};
