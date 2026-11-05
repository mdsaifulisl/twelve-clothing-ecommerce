import type { OrderStatus } from '../../types';

export type { OrderStatus } from '../../types';
export type OrderCity = 'dhaka' | 'outside';
export type PaymentMethod = 'cod' | 'online';

export interface CreateOrderRequest {
  customerName: string;
  phone: string;
  address: string;
  city: OrderCity;
  paymentMethod: PaymentMethod;
  deviceId: string;
  items: Array<{ productId: string; size: string; color: string; quantity: number }>;
}

export interface OrderItemResponse {
  id?: string;
  productId?: string | null;
  title: string;
  sku: string;
  size: string;
  color: string | null;
  image?: string | null;
  unitPrice: string;
  quantity: number;
  lineTotal: string;
}

export interface OrderResponse {
  id?: string;
  orderCode: string;
  customerName?: string;
  phone?: string;
  address?: string;
  city?: OrderCity;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  subtotal: string;
  deliveryCharge: string;
  totalAmount: string;
  clientIp?: string | null;
  deviceFingerprint?: string | null;
  seenAt?: string | null;
  seenBy?: string | null;
  archivedAt?: string | null;
  archivedBy?: string | null;
  createdAt: string;
  items: OrderItemResponse[];
}

export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface OrderListResponse extends ApiEnvelope<OrderResponse[]> {
  count: number;
  pagination: { page: number; limit: number; totalPages: number };
}

export interface SellerOrderQuery {
  status?: OrderStatus;
  search?: string;
  archived?: 'true' | 'false' | 'all';
  page?: number;
  limit?: number;
}

export interface OrderState {
  sellerOrders: OrderResponse[];
  sellerOrdersLoading: boolean;
  sellerOrdersError: string | null;
  sellerOrderCount: number;
  sellerOrderTotalPages: number;
  mutationId: string | null;
  mutationError: string | null;
  isCreatingOrder: boolean;
  createOrderError: string | null;
  createdOrder: OrderResponse | null;
  isLookingUpOrder: boolean;
  lookupError: string | null;
  lookupErrorStatus: number | null;
  trackedOrder: OrderResponse | null;
}
