import prisma from '../config/prisma.js';
import type { OrderStatus } from '@prisma/client';

export type DashboardPeriod = 'daily' | 'weekly' | 'monthly';

interface RecentOrderRecord {
  id: string;
  orderCode: string;
  customerName: string;
  totalAmount: { toFixed: (digits: number) => string };
  status: OrderStatus;
  createdAt: Date;
  items: Array<{ productTitle: string }>;
}

const moneyString = (value: { toFixed: (digits: number) => string } | null | undefined) => value?.toFixed(2) ?? '0.00';
const percentChange = (current: number, previous: number): number | null => previous === 0 ? null : Number((((current - previous) / previous) * 100).toFixed(1));
const utcStartOfDay = (date: Date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
const utcStartOfWeek = (date: Date) => {
  const start = utcStartOfDay(date);
  start.setUTCDate(start.getUTCDate() - ((start.getUTCDay() + 6) % 7));
  return start;
};

export const getDashboardSummary = async (period: DashboardPeriod) => {
  const now = new Date();
  const thisMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const previousMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const nextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  const today = utcStartOfDay(now);
  const trendStart = period === 'daily'
    ? new Date(today.getTime() - 13 * 86400000)
    : period === 'weekly'
      ? new Date(utcStartOfWeek(now).getTime() - 7 * 7 * 86400000)
      : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11, 1));

  const trendWhere = { archivedAt: null, createdAt: { gte: trendStart } };
  const activeOrdersWhere = { archivedAt: null };
  const [totalOrders, statusGroups, customerCount, productCount, currentRevenue, previousRevenue, monthlyOrderAverage, topOrders, recentOrders, trendOrders] = await Promise.all([
    prisma.order.count({ where: activeOrdersWhere }),
    prisma.order.groupBy({ by: ['status'], where: activeOrdersWhere, _count: { _all: true } }),
    prisma.customer.count(),
    prisma.product.count(),
    prisma.order.aggregate({ where: { ...activeOrdersWhere, status: 'DELIVERED', createdAt: { gte: thisMonth, lt: nextMonth } }, _sum: { totalAmount: true } }),
    prisma.order.aggregate({ where: { ...activeOrdersWhere, status: 'DELIVERED', createdAt: { gte: previousMonth, lt: thisMonth } }, _sum: { totalAmount: true } }),
    prisma.order.aggregate({ where: { ...activeOrdersWhere, status: 'DELIVERED', createdAt: { gte: thisMonth, lt: nextMonth } }, _avg: { totalAmount: true } }),
    prisma.order.findMany({
      where: { ...activeOrdersWhere, status: 'DELIVERED', createdAt: { gte: thisMonth, lt: nextMonth } },
      select: { items: { select: { quantity: true, product: { select: { category: true } } } } },
    }),
    prisma.order.findMany({
      where: activeOrdersWhere,
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, orderCode: true, customerName: true, totalAmount: true, status: true, createdAt: true, items: { select: { productTitle: true } } },
    }),
    prisma.order.findMany({
      where: trendWhere,
      select: { createdAt: true, status: true, totalAmount: true },
    }),
  ]);

  const statusCounts = { PENDING: 0, PROCESSING: 0, DELIVERED: 0, CANCELLED: 0 };
  for (const group of statusGroups as Array<{ status: OrderStatus; _count: { _all: number } }>) {
    statusCounts[group.status] = group._count._all;
  }

  const categorySales = new Map<string, number>();
  for (const order of topOrders) {
    for (const item of order.items) {
      const category = item.product?.category;
      if (category) categorySales.set(category, (categorySales.get(category) ?? 0) + item.quantity);
    }
  }
  const topCategory = [...categorySales.entries()].sort((a, b) => b[1] - a[1])[0];

  const bucketKey = (date: Date) => {
    const day = utcStartOfDay(date);
    if (period === 'daily') return day.toISOString().slice(0, 10);
    if (period === 'weekly') return utcStartOfWeek(date).toISOString().slice(0, 10);
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
  };
  const bucketLabels = new Map<string, string>();
  const bucketCursor = new Date(trendStart);
  const bucketCount = period === 'daily' ? 14 : period === 'weekly' ? 8 : 12;
  for (let index = 0; index < bucketCount; index += 1) {
    const key = bucketKey(bucketCursor);
    const label = period === 'daily'
      ? bucketCursor.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
      : period === 'weekly'
        ? `${bucketCursor.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}`
        : bucketCursor.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
    bucketLabels.set(key, label);
    if (period === 'daily') bucketCursor.setUTCDate(bucketCursor.getUTCDate() + 1);
    else if (period === 'weekly') bucketCursor.setUTCDate(bucketCursor.getUTCDate() + 7);
    else bucketCursor.setUTCMonth(bucketCursor.getUTCMonth() + 1);
  }

  const buckets = new Map([...bucketLabels.keys()].map((key) => [key, { label: bucketLabels.get(key)!, orders: 0, revenue: 0 }]));
  for (const order of trendOrders as Array<{ createdAt: Date; status: OrderStatus; totalAmount: { toString: () => string } }>) {
    const bucket = buckets.get(bucketKey(order.createdAt));
    if (!bucket) continue;
    bucket.orders += 1;
    if (order.status === 'DELIVERED') bucket.revenue += Number(order.totalAmount);
  }

  const currentRevenueAmount = Number(currentRevenue._sum.totalAmount ?? 0);
  const previousRevenueAmount = Number(previousRevenue._sum.totalAmount ?? 0);

  return {
    generatedAt: now.toISOString(),
    stats: {
      totalRevenue: moneyString(currentRevenue._sum.totalAmount),
      revenueChangePercent: percentChange(currentRevenueAmount, previousRevenueAmount),
      totalOrders,
      totalCustomers: customerCount,
      totalProducts: productCount,
      averageOrderValue: moneyString(monthlyOrderAverage._avg.totalAmount),
    },
    statusCounts,
    trend: { period, buckets: [...buckets.values()].map((bucket) => ({ ...bucket, revenue: bucket.revenue.toFixed(2) })) },
    topCategory: topCategory ? { name: topCategory[0], itemsSold: topCategory[1] } : null,
    recentOrders: (recentOrders as RecentOrderRecord[]).map((order) => ({
      id: order.id,
      orderCode: order.orderCode,
      customerName: order.customerName,
      products: order.items.map((item) => item.productTitle),
      totalAmount: moneyString(order.totalAmount),
      status: order.status,
      createdAt: order.createdAt,
    })),
  };
};
