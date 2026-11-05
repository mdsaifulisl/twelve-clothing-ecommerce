import type { Request, Response } from 'express';
import { getFullImageUrl } from '../utils/getImageUrl.js';
import { getAboutSection, updateAboutSection } from '../services/aboutSection.service.js';
import type { UpdateAboutSectionInput } from '../validations/aboutSection.validation.js';

const serializeAboutSection = (req: Request, section: {
  title: string;
  paragraph1: string;
  paragraph2: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  updatedAt?: Date;
}) => ({
  title: section.title,
  paragraph1: section.paragraph1,
  paragraph2: section.paragraph2,
  buttonText: section.buttonText,
  buttonLink: section.buttonLink,
  imageUrl: getFullImageUrl(req, section.imageUrl),
  ...(section.updatedAt ? { updatedAt: section.updatedAt } : {}),
});

export const getAboutSectionHandler = async (req: Request, res: Response) => {
  const section = await getAboutSection();
  return res.status(200).json({ success: true, data: serializeAboutSection(req, section) });
};

export const updateAboutSectionHandler = async (req: Request, res: Response) => {
  const section = await updateAboutSection(req.body as UpdateAboutSectionInput);
  return res.status(200).json({
    success: true,
    message: 'About section updated successfully',
    data: serializeAboutSection(req, section),
  });
};
