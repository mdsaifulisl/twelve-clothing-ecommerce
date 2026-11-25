import type { Request, Response } from 'express';
import { getManagedSettings, getPublicSettings, updateBrandingImages, updateSettingsSection } from '../services/settings.service.js';
import { sendTelegramTestAlert } from '../services/telegram.service.js';
import { settingsSchemas, settingsSectionSchema } from '../validations/settings.validation.js';
import { AppError } from '../utils/AppError.js';
import { getFullImageUrl } from '../utils/getImageUrl.js';

const IMAGE_KEYS = new Set(['logoUrl', 'faviconUrl', 'logo', 'favicon', 'image']);

const formatSettingsImages = (req: Request, value: unknown): unknown => {
  if (!value || typeof value !== 'object') return value;

  if (Array.isArray(value)) {
    return value.map((item) => formatSettingsImages(req, item));
  }

  const record = value as Record<string, unknown>;
  const formatted: Record<string, unknown> = {};

  for (const [key, val] of Object.entries(record)) {
    if (IMAGE_KEYS.has(key)) {
      if (typeof val === 'string' && val.trim().length > 0) {
        formatted[key] = getFullImageUrl(req, val);
      } else if (Array.isArray(val)) {
        formatted[key] = val.map((img) =>
          typeof img === 'string' && img.trim().length > 0 ? getFullImageUrl(req, img) : img,
        );
      } else {
        formatted[key] = val;
      }
    } else {
      formatted[key] = formatSettingsImages(req, val);
    }
  }

  return formatted;
};

export const getPublicSettingsHandler = async (req: Request, res: Response) => {
  const data = await getPublicSettings();
  return res.status(200).json({ success: true, data: formatSettingsImages(req, data) });
};

export const getManagedSettingsHandler = async (req: Request, res: Response) => {
  const data = await getManagedSettings();
  return res.status(200).json({ success: true, data: formatSettingsImages(req, data) });
};

export const updateSettingsHandler = async (req: Request, res: Response) => {
  const section = settingsSectionSchema.safeParse(req.params.section);
  if (!section.success) throw new AppError('Settings section not found.', 404);
  const validation = settingsSchemas[section.data].safeParse(req.body);
  if (!validation.success) {
    throw new AppError('Validation failed', 400, validation.error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })));
  }
  const data = await updateSettingsSection(section.data, validation.data as never);
  return res.status(200).json({ success: true, message: 'Settings updated successfully.', data: formatSettingsImages(req, data) });
};

export const updateBrandingHandler = async (req: Request, res: Response) => {
  const images = res.locals.settingsBrandingImages as { logoUrl?: string; faviconUrl?: string } | undefined;
  const data = await updateBrandingImages(images ?? {});
  return res.status(200).json({ success: true, message: 'Branding settings updated successfully.', data: formatSettingsImages(req, data) });
};

export const sendTelegramTestAlertHandler = async (_req: Request, res: Response) => {
  await sendTelegramTestAlert();
  return res.status(200).json({ success: true, message: 'Telegram test alert sent successfully.' });
};