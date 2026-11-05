import axios from 'axios';
import axiosInstance from '../../api/axiosInstance';
import type { TermsPageContent } from './termsType';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Array<{ message?: string }>;
}

export const getTermsErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError<ApiEnvelope<unknown>>(error)) return fallback;
  const issues = error.response?.data?.errors;
  if (Array.isArray(issues) && issues.length) return issues.map((issue) => issue.message).filter(Boolean).join(', ');
  return error.response?.data?.message || fallback;
};

export const fetchTermsPage = async (signal?: AbortSignal) => {
  const response = await axiosInstance.get<ApiEnvelope<TermsPageContent>>('/terms', { signal });
  return response.data.data;
};

export const saveTermsPage = async (content: TermsPageContent) => {
  const response = await axiosInstance.put<ApiEnvelope<TermsPageContent>>('/terms', content);
  return response.data.data;
};
