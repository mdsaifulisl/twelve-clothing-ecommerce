import axiosInstance from '../../api/axiosInstance';
import type { CreateLogPayload } from './logTypes';

export const fetchLogsAPI = async (params?: { search?: string; module?: string }) => {
  const response = await axiosInstance.get('/logs', { params });
  return response.data;
};

export const createLogAPI = async (logData: CreateLogPayload) => {
  const response = await axiosInstance.post('/logs', logData);
  return response.data;
};

export const clearLogsAPI = async () => {
  const response = await axiosInstance.delete('/logs');
  return response.data;
};



