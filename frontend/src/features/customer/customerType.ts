export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  normalizedPhone: string;
  isBlocked: boolean;
  blockReason: string | null;
  blockedAt: string | null;
  createdAt: string;
  updatedAt: string;
  totalOrders: number;
  totalOrderValue: string;
  lastOrderDate: string | null;
  address: string | null;
  city: string | null;
  ipAddress: string | null;
  isIpBlocked: boolean;
  devices: CustomerDeviceRecord[];
}

export interface CustomerDeviceRecord {
  id: string;
  label: string;
  isBlocked: boolean;
  ips: string[];
  phones: string[];
  phoneCustomers?: Array<{ phone: string; customerId: string | null; isBlocked: boolean }>;
  lastSeenAt: string | null;
}

export interface BlockedIpRecord {
  id: string;
  address: string;
  family: 'IPV4' | 'IPV6';
  isBlocked: boolean;
  reason: string | null;
  blockedAt: string;
  blockedBy: string | null;
  unblockedAt: string | null;
  unblockedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerManagementState {
  customers: CustomerRecord[];
  blockedIps: BlockedIpRecord[];
  isLoading: boolean;
  error: string | null;
  mutationId: string | null;
  fetchRequestId: string | null;
}

export interface CustomerListResponse {
  success: boolean;
  count: number;
  data: CustomerRecord[];
  pagination: { page: number; limit: number; totalPages: number };
}

export interface BlockedIpListResponse {
  success: boolean;
  count: number;
  data: BlockedIpRecord[];
  pagination: { page: number; limit: number; totalPages: number };
}
