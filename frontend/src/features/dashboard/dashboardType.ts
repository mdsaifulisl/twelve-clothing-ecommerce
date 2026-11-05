export type DashboardPeriod = 'daily' | 'weekly' | 'monthly';

export interface DashboardSummary {
  generatedAt: string;
  stats: {
    totalRevenue: string;
    revenueChangePercent: number | null;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    averageOrderValue: string;
  };
  statusCounts: Record<'PENDING' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED', number>;
  trend: {
    period: DashboardPeriod;
    buckets: Array<{ label: string; orders: number; revenue: string }>;
  };
  topCategory: { name: string; itemsSold: number } | null;
  recentOrders: Array<{
    id: string;
    orderCode: string;
    customerName: string;
    products: string[];
    totalAmount: string;
    status: 'PENDING' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED';
    createdAt: string;
  }>;
}

export interface DashboardState {
  summary: DashboardSummary | null;
  period: DashboardPeriod;
  isLoading: boolean;
  error: string | null;
  requestId: string | null;
}
