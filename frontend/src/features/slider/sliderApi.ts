import axios from 'axios';
import axiosInstance from '../../api/axiosInstance';
import type { BannerSlide, SliderListResponse } from './sliderType';

export const getSliderErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: string; errors?: Array<{ message?: string }> }>(error)) {
    const issues = error.response?.data?.errors;
    if (Array.isArray(issues) && issues.length) return issues.map((issue) => issue.message).filter(Boolean).join(', ');
    return error.response?.data?.message || fallback;
  }
  return fallback;
};

export const listSliders = async (signal?: AbortSignal) => {
  const response = await axiosInstance.get<SliderListResponse>('/sliders', { signal });
  return response.data;
};

export const createSlider = async (payload: FormData) => {
  const response = await axiosInstance.post<{ success: boolean; data: BannerSlide }>('/sliders', payload);
  return response.data.data;
};

export const updateSlider = async (id: string, payload: FormData) => {
  const response = await axiosInstance.patch<{ success: boolean; data: BannerSlide }>(`/sliders/${id}`, payload);
  return response.data.data;
};

export const deleteSlider = async (id: string) => {
  await axiosInstance.delete(`/sliders/${id}`);
  return id;
};
