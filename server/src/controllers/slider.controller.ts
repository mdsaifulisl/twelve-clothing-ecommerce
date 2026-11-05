import type { Request, Response } from 'express';
import { AppError } from '../utils/AppError.js';
import { getFullImageUrl } from '../utils/getImageUrl.js';
import { createSlider, deleteSlider, listSliders, updateSlider } from '../services/slider.service.js';
import { sliderIdSchema, type CreateSliderInput, type UpdateSliderInput } from '../validations/slider.validation.js';

interface SliderRecord {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  link: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const serializeSlider = (req: Request, slider: SliderRecord) => ({
  ...slider,
  image: getFullImageUrl(req, slider.image),
});

const parseSliderId = (value: string | string[]) => {
  const result = sliderIdSchema.safeParse(Array.isArray(value) ? value[0] : value);
  if (!result.success) {
    throw new AppError('Validation failed', 400, result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    })));
  }
  return result.data;
};

export const listSlidersHandler = async (req: Request, res: Response) => {
  const sliders = await listSliders();
  return res.status(200).json({ success: true, count: sliders.length, data: sliders.map((slider: SliderRecord) => serializeSlider(req, slider)) });
};

export const createSliderHandler = async (req: Request, res: Response) => {
  const slider = await createSlider(req.body as CreateSliderInput);
  return res.status(201).json({ success: true, message: 'Slider created successfully', data: serializeSlider(req, slider) });
};

export const updateSliderHandler = async (req: Request, res: Response) => {
  const id = parseSliderId(req.params.id);
  const slider = await updateSlider(id, req.body as UpdateSliderInput);
  return res.status(200).json({ success: true, message: 'Slider updated successfully', data: serializeSlider(req, slider) });
};

export const deleteSliderHandler = async (req: Request, res: Response) => {
  const id = parseSliderId(req.params.id);
  await deleteSlider(id);
  return res.status(200).json({ success: true, message: 'Slider deleted successfully' });
};
