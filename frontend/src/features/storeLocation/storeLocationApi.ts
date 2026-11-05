import axios from 'axios';
import axiosInstance from '../../api/axiosInstance';
import type { CreateStoreLocationRequest, StoreLocation, StoreLocationListResponse } from './storeLocationType';

export const getStoreLocationErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: string; errors?: Array<{ message?: string }> }>(error)) {
    const issues = error.response?.data?.errors;
    if (Array.isArray(issues) && issues.length) return issues.map((issue) => issue.message).filter(Boolean).join(', ');
    return error.response?.data?.message || fallback;
  }
  return fallback;
};

export const listStoreLocations = async (signal?: AbortSignal) => {
  const response = await axiosInstance.get<StoreLocationListResponse>('/locations', { signal });
  return response.data;
};

export const createStoreLocation = async (payload: CreateStoreLocationRequest) => {
  const response = await axiosInstance.post<{ success: boolean; data: StoreLocation }>('/locations', payload);
  return response.data.data;
};

export const deleteStoreLocation = async (id: string) => {
  await axiosInstance.delete(`/locations/${id}`);
  return id;
};
