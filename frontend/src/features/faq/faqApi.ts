import axios from 'axios';
import axiosInstance from '../../api/axiosInstance';
import type { FaqItem } from './faqType';

interface FaqEnvelope {
  success: boolean;
  data: { items: FaqItem[] };
  message?: string;
  errors?: Array<{ message?: string }>;
}

export const getFaqErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError<FaqEnvelope>(error)) return fallback;
  const issues = error.response?.data?.errors;
  if (Array.isArray(issues) && issues.length) return issues.map((issue) => issue.message).filter(Boolean).join(', ');
  return error.response?.data?.message || fallback;
};

export const fetchFaqItems = async (signal?: AbortSignal) => {
  const response = await axiosInstance.get<FaqEnvelope>('/faq', { signal });
  return response.data.data.items;
};

export const saveFaqItems = async (items: FaqItem[]) => {
  const response = await axiosInstance.put<FaqEnvelope>('/faq', { items });
  return response.data.data.items;
};
