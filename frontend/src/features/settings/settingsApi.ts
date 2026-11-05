import axios from 'axios';
import axiosInstance from '../../api/axiosInstance';
import type { ManagedSettings, PublicStoreSettings, SettingsSection } from './settingsType';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const getSettingsErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: string; errors?: Array<{ message?: string }> }>(error)) {
    const issues = error.response?.data?.errors;
    if (Array.isArray(issues) && issues.length) return issues.map((issue) => issue.message).filter(Boolean).join(', ');
    return error.response?.data?.message || fallback;
  }
  return fallback;
};

export const fetchManagedSettings = async (signal?: AbortSignal) => {
  const response = await axiosInstance.get<ApiEnvelope<ManagedSettings>>('/settings/manage', { signal });
  return response.data.data;
};

export const fetchPublicSettings = async (signal?: AbortSignal) => {
  const response = await axiosInstance.get<ApiEnvelope<PublicStoreSettings>>('/settings', { signal });
  return response.data.data;
};

export const updateSettingsSection = async (section: SettingsSection, data: unknown) => {
  const response = await axiosInstance.patch<ApiEnvelope<unknown>>(`/settings/manage/${section}`, data);
  return response.data.data;
};

export const uploadSettingsBranding = async (logo?: File, favicon?: File) => {
  const form = new FormData();
  if (logo) form.append('logo', logo);
  if (favicon) form.append('favicon', favicon);
  const response = await axiosInstance.patch<ApiEnvelope<ManagedSettings['branding']>>('/settings/manage/branding', form);
  return response.data.data;
};

export const sendTelegramTestAlert = async () => {
  const response = await axiosInstance.post<ApiEnvelope<null>>('/settings/manage/telegram/test');
  return response.data.message || 'Telegram test alert sent successfully.';
};
