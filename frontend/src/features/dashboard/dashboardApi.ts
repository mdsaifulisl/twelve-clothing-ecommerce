import axios from 'axios';
import axiosInstance from '../../api/axiosInstance';
import type { DashboardPeriod, DashboardSummary } from './dashboardType';

interface DashboardEnvelope {
  success: boolean;
  data: DashboardSummary;
  message?: string;
}

export const getDashboardErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<DashboardEnvelope>(error)) {
    return error.response?.data?.message || 'Could not load dashboard data.';
  }
  return 'Could not load dashboard data.';
};

export const fetchDashboardSummary = async (period: DashboardPeriod, signal?: AbortSignal) => {
  const response = await axiosInstance.get<DashboardEnvelope>('/dashboard/summary', { params: { period }, signal });
  return response.data.data;
};
