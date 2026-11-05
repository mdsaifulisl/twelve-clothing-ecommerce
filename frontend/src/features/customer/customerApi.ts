import axios from 'axios';
import axiosInstance from '../../api/axiosInstance';
import type { BlockedIpListResponse, BlockedIpRecord, CustomerDeviceRecord, CustomerListResponse, CustomerRecord } from './customerType';

interface DataEnvelope<T> {
  success: boolean;
  data: T;
}

export const getCustomerErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: string; errors?: Array<{ message?: string }> }>(error)) {
    const issues = error.response?.data?.errors;
    if (Array.isArray(issues) && issues.length) return issues.map((issue) => issue.message).filter(Boolean).join(', ');
    return error.response?.data?.message || fallback;
  }
  return fallback;
};

export const listCustomers = async (params: { search?: string; blocked?: 'true' | 'false' | 'all'; page?: number; limit?: number; signal?: AbortSignal }) => {
  const response = await axiosInstance.get<CustomerListResponse>('/customers', { params, signal: params.signal });
  return response.data;
};

export const setCustomerBlocked = async (id: string, blocked: boolean, reason?: string) => {
  const response = blocked
    ? await axiosInstance.patch<DataEnvelope<CustomerRecord>>(`/customers/${id}/block`, reason ? { reason } : {})
    : await axiosInstance.patch<DataEnvelope<CustomerRecord>>(`/customers/${id}/unblock`);
  return response.data.data;
};

export const setCustomerDeviceBlocked = async (id: string, blocked: boolean, reason?: string) => {
  const response = blocked
    ? await axiosInstance.patch<DataEnvelope<CustomerDeviceRecord>>(`/customers/devices/${id}/block`, reason ? { reason } : {})
    : await axiosInstance.patch<DataEnvelope<CustomerDeviceRecord>>(`/customers/devices/${id}/unblock`);
  return response.data.data;
};

export const listBlockedIps = async (params: { status?: 'active' | 'all'; search?: string; page?: number; limit?: number; signal?: AbortSignal }) => {
  const response = await axiosInstance.get<BlockedIpListResponse>('/blocked-ips', { params, signal: params.signal });
  return response.data;
};

export const createBlockedIp = async (ipAddress: string, reason?: string) => {
  const response = await axiosInstance.post<DataEnvelope<BlockedIpRecord>>('/blocked-ips', { ipAddress, reason });
  return response.data.data;
};

export const unblockIp = async (id: string) => {
  const response = await axiosInstance.patch<DataEnvelope<BlockedIpRecord>>(`/blocked-ips/${id}/unblock`);
  return response.data.data;
};
