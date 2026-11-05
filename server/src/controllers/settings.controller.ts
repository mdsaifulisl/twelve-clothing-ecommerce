import type { Request, Response } from 'express';
import { getManagedSettings, getPublicSettings, updateBrandingImages, updateSettingsSection } from '../services/settings.service.js';
import { sendTelegramTestAlert } from '../services/telegram.service.js';
import { settingsSchemas, settingsSectionSchema } from '../validations/settings.validation.js';
import { AppError } from '../utils/AppError.js';

export const getPublicSettingsHandler = async (_req: Request, res: Response) =>
  res.status(200).json({ success: true, data: await getPublicSettings() });

export const getManagedSettingsHandler = async (_req: Request, res: Response) =>
  res.status(200).json({ success: true, data: await getManagedSettings() });

export const updateSettingsHandler = async (req: Request, res: Response) => {
  const section = settingsSectionSchema.safeParse(req.params.section);
  if (!section.success) throw new AppError('Settings section not found.', 404);
  const validation = settingsSchemas[section.data].safeParse(req.body);
  if (!validation.success) {
    throw new AppError('Validation failed', 400, validation.error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })));
  }
  const data = await updateSettingsSection(section.data, validation.data as never);
  return res.status(200).json({ success: true, message: 'Settings updated successfully.', data });
};

export const updateBrandingHandler = async (_req: Request, res: Response) => {
  const images = res.locals.settingsBrandingImages as { logoUrl?: string; faviconUrl?: string } | undefined;
  const data = await updateBrandingImages(images ?? {});
  return res.status(200).json({ success: true, message: 'Branding settings updated successfully.', data });
};

export const sendTelegramTestAlertHandler = async (_req: Request, res: Response) => {
  await sendTelegramTestAlert();
  return res.status(200).json({ success: true, message: 'Telegram test alert sent successfully.' });
};
