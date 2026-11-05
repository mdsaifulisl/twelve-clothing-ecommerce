import { Prisma } from '@prisma/client';
import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { deleteLocalFile } from '../utils/file.util.js';
import type { CreateSliderInput, UpdateSliderInput } from '../validations/slider.validation.js';

const removeUploadedSliderImage = (image: string) => {
  if (image.startsWith('/uploads/slider/')) deleteLocalFile(image);
};

export const listSliders = () => prisma.bannerSlider.findMany({ orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] });

export const createSlider = (input: CreateSliderInput) => prisma.bannerSlider.create({
  data: {
    title: input.title,
    subtitle: input.subtitle,
    buttonText: input.buttonText,
    link: input.link,
    image: input.image,
  },
});

export const updateSlider = async (id: string, input: UpdateSliderInput) => {
  const existing = await prisma.bannerSlider.findUnique({ where: { id } });
  if (!existing) throw new AppError('Slider not found', 404);

  try {
    const updated = await prisma.bannerSlider.update({ where: { id }, data: input });
    if (input.image && input.image !== existing.image) removeUploadedSliderImage(existing.image);
    return updated;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new AppError('Slider not found', 404);
    }
    throw error;
  }
};

export const deleteSlider = async (id: string) => {
  const existing = await prisma.bannerSlider.findUnique({ where: { id } });
  if (!existing) throw new AppError('Slider not found', 404);

  const deleted = await prisma.bannerSlider.delete({ where: { id } });
  removeUploadedSliderImage(existing.image);
  return deleted;
};
