import axios from 'axios';
import axiosInstance from '../../api/axiosInstance';
import type { AboutSection, AboutSectionResponse, UpdateAboutSectionRequest } from './aboutSectionType';

export const getAboutSectionErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: string; errors?: Array<{ message?: string }> }>(error)) {
    const issues = error.response?.data?.errors;
    if (Array.isArray(issues) && issues.length) return issues.map((issue) => issue.message).filter(Boolean).join(', ');
    return error.response?.data?.message || fallback;
  }
  return fallback;
};

export const fetchAboutSection = async (signal?: AbortSignal) => {
  const response = await axiosInstance.get<AboutSectionResponse>('/about-section', { signal });
  return response.data.data;
};

export const saveAboutSection = async (payload: UpdateAboutSectionRequest) => {
  const formData = new FormData();
  formData.append('title', payload.title);
  formData.append('paragraph1', payload.paragraph1);
  formData.append('paragraph2', payload.paragraph2);
  formData.append('buttonText', payload.buttonText);
  formData.append('buttonLink', payload.buttonLink);
  if (payload.image) formData.append('images', payload.image);

  const response = await axiosInstance.put<AboutSectionResponse>('/about-section', formData);
  return response.data.data;
};

export type { AboutSection };
