import type { Request, Response } from 'express';
import { getFaqPage, updateFaqPage } from '../services/faq.service.js';
import type { UpdateFaqPageInput } from '../validations/faq.validation.js';

export const getFaqPageHandler = async (_req: Request, res: Response) => {
  const items = await getFaqPage();
  return res.status(200).json({ success: true, data: { items } });
};

export const updateFaqPageHandler = async (req: Request, res: Response) => {
  const items = await updateFaqPage(req.body as UpdateFaqPageInput);
  return res.status(200).json({ success: true, message: 'FAQ page updated successfully', data: { items } });
};
