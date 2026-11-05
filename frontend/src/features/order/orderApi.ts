import axios from 'axios';
import axiosInstance from '../../api/axiosInstance';
import type { ApiEnvelope, CreateOrderRequest, OrderListResponse, OrderResponse, OrderStatus, SellerOrderQuery } from './orderType';

export type { CreateOrderRequest, OrderCity, OrderItemResponse, OrderListResponse, OrderResponse, OrderStatus, PaymentMethod, SellerOrderQuery } from './orderType';

export const getOrderErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: string; errors?: Array<{ field?: string; message?: string }> | null }>(error)) {
    const details = error.response?.data?.errors;
    if (Array.isArray(details) && details.length > 0) {
      const detailText = details
        .map((detail) => [detail.field, detail.message].filter(Boolean).join(': '))
        .filter(Boolean)
        .join('; ');
      if (detailText) return `${error.response?.data?.message || fallback}: ${detailText}`;
    }
    return error.response?.data?.message || fallback;
  }
  return fallback;
};

export const createOrder = async (payload: CreateOrderRequest) => {
  const response = await axiosInstance.post<ApiEnvelope<OrderResponse>>('/orders', payload);
  return response.data.data;
};

export const lookupOrder = async (orderCode: string, phone: string) => {
  const response = await axiosInstance.post<ApiEnvelope<OrderResponse>>('/orders/lookup', { orderCode, phone });
  return response.data.data;
};

export const listOrders = async (params: SellerOrderQuery & { signal?: AbortSignal }) => {
  const response = await axiosInstance.get<OrderListResponse>('/orders', { params, signal: params.signal });
  return response.data;
};

export const updateOrderStatus = async (id: string, status: OrderStatus) => {
  const response = await axiosInstance.patch<ApiEnvelope<OrderResponse>>(`/orders/${id}/status`, { status });
  return response.data.data;
};

export const setOrderArchived = async (id: string, archived: boolean) => {
  const response = await axiosInstance.patch<ApiEnvelope<OrderResponse>>(`/orders/${id}/archive`, { archived });
  return response.data.data;
};

export const markOrderSeen = async (id: string) => {
  const response = await axiosInstance.patch<ApiEnvelope<OrderResponse>>(`/orders/${id}/seen`);
  return response.data.data;
};
