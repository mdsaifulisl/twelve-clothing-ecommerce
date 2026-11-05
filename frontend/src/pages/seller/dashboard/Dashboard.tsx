import React, { useEffect } from 'react';
import { ShoppingBag, Users, DollarSign, Package, Clock, PackageCheck, AlertCircle, XCircle, Download, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SalesAndOrderTrends } from '../../../components/seller/dashboard/SalesAndOrderTrends';
import { useDashboard } from '../../../features/dashboard/useDashboard';
import type { DashboardPeriod, DashboardSummary } from '../../../features/dashboard/dashboardType';

const money = (value?: string | null) => value == null ? '—' : `৳ ${Number(value).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const statusLabel: Record<keyof DashboardSummary['statusCounts'], string> = {
  PENDING: 'Pending', PROCESSING: 'Processing', DELIVERED: 'Delivered', CANCELLED: 'Cancelled',
};
const csvCell = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;

export const Dashboard: React.FC = () => {
  const { summary, period, isLoading, error, loadSummary } = useDashboard();

  useEffect(() => {
    const request = loadSummary('monthly');
    return () => request.abort();
  }, [loadSummary]);

  const downloadReport = () => {
    if (!summary) return;
    const rows: Array<Array<string | number>> = [
      ['Twelve Clothing Dashboard Report'],
      ['Generated at', summary.generatedAt],
      ['Delivered revenue this month (BDT)', summary.stats.totalRevenue],
      ['Active orders', summary.stats.totalOrders],
      ['Customers', summary.stats.totalCustomers],
      ['Products', summary.stats.totalProducts],
      [],
      ['Order Code', 'Customer', 'Products', 'Amount (BDT)', 'Status', 'Date'],
      ...summary.recentOrders.map((order) => [order.orderCode, order.customerName, order.products.join('; '), order.totalAmount, statusLabel[order.status], new Date(order.createdAt).toLocaleString('en-BD')]),
    ];
    const csv = rows.map((row) => row.map((cell) => csvCell(cell ?? '')).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `twelve-clothing-dashboard-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const stats = [
    { title: 'Delivered Revenue This Month', value: money(summary?.stats.totalRevenue), note: summary?.stats.revenueChangePercent == null ? 'No previous-month baseline' : `${summary.stats.revenueChangePercent > 0 ? '+' : ''}${summary.stats.revenueChangePercent}% vs last month`, icon: DollarSign, color: 'bg-cardHeader' },
    { title: 'Active Orders', value: summary?.stats.totalOrders.toLocaleString('en-BD') ?? '—', note: 'Excludes archived orders', icon: ShoppingBag, color: 'bg-cardBody' },
    { title: 'Customers', value: summary?.stats.totalCustomers.toLocaleString('en-BD') ?? '—', note: 'Customer records', icon: Users, color: 'bg-cardAccent' },
    { title: 'Products', value: summary?.stats.totalProducts.toLocaleString('en-BD') ?? '—', note: 'Products in catalog', icon: Package, color: 'bg-primary' },
  ];

  const statuses = [
    { status: 'PENDING' as const, icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
    { status: 'PROCESSING' as const, icon: PackageCheck, color: 'bg-blue-100 text-blue-700' },
    { status: 'DELIVERED' as const, icon: PackageCheck, color: 'bg-green-100 text-green-700' },
    { status: 'CANCELLED' as const, icon: XCircle, color: 'bg-red-100 text-red-700' },
  ];

  const changePeriod = (nextPeriod: DashboardPeriod) => {
    if (nextPeriod !== period) void loadSummary(nextPeriod);
  };

  return (
    <div className="space-y-6 pb-10 font-sans">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-primary sm:text-2xl">Dashboard Overview</h1>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">Live store performance and recent order activity.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => void loadSummary(period)} disabled={isLoading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-borderLight bg-white px-4 py-2.5 text-sm font-medium text-primary hover:bg-surface disabled:opacity-60">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button type="button" onClick={downloadReport} disabled={!summary} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cardHeader px-4 py-2.5 text-sm font-medium text-white shadow-xs hover:bg-cardAccent disabled:cursor-not-allowed disabled:opacity-50">
            <Download className="h-4 w-4" /> Download Report
          </button>
        </div>
      </div>

      {error && <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><div><p className="font-semibold">Could not load dashboard data</p><p className="mt-1">{error}</p></div></div>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return <div key={stat.title} className="flex items-center justify-between rounded-2xl border border-borderLight bg-white p-5 shadow-xs transition-shadow hover:shadow-md sm:p-6">
            <div className="min-w-0"><p className="text-xs font-medium uppercase tracking-wider text-gray-500">{stat.title}</p><h2 className="mt-1 font-heading text-xl font-bold text-primary sm:text-2xl">{stat.value}</h2><span className="mt-2 block text-xs text-gray-500">{stat.note}</span></div>
            <div className={`${stat.color} shrink-0 rounded-xl p-3.5 text-white shadow-sm sm:p-4`}><Icon className="h-5 w-5 sm:h-6 sm:w-6" /></div>
          </div>;
        })}
      </div>

      <SalesAndOrderTrends period={period} buckets={summary?.trend.buckets ?? []} onPeriodChange={changePeriod} isLoading={isLoading} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="flex flex-col justify-between rounded-2xl border border-borderLight bg-white p-5 shadow-xs sm:p-6">
          <div><h2 className="mb-4 font-heading text-base font-semibold text-primary sm:text-lg">Order Status Summary</h2><div className="space-y-3">
            {statuses.map(({ status, icon: Icon, color }) => <div key={status} className="flex items-center justify-between rounded-xl border border-borderLight bg-surface p-3">
              <div className="flex items-center gap-3"><div className={`shrink-0 rounded-lg p-2 ${color}`}><Icon className="h-4 w-4 sm:h-5 sm:w-5" /></div><span className="text-xs font-medium text-gray-700 sm:text-sm">{statusLabel[status]}</span></div>
              <span className="text-sm font-bold text-primary sm:text-base">{summary?.statusCounts[status].toLocaleString('en-BD') ?? '—'}</span>
            </div>)}
          </div></div>
          <Link to="/seller/orders" className="mt-5 w-full rounded-xl border border-borderLight bg-surface py-2.5 text-center text-sm font-medium text-cardAccent transition-colors hover:bg-cardHeader/10">View All Orders</Link>
        </section>

        <section className="flex flex-col justify-between rounded-2xl border border-borderLight bg-white p-5 shadow-xs sm:p-6 lg:col-span-2">
          <div><h2 className="font-heading text-base font-semibold text-primary sm:text-lg">Top Selling Highlights</h2><p className="mb-5 mt-1 text-xs text-gray-500 sm:text-sm">Based on delivered orders this month.</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-borderLight bg-surface p-4"><p className="text-xs font-medium text-gray-500">Top Category</p><p className="mt-1 text-base font-bold text-primary sm:text-lg">{summary?.topCategory?.name ?? 'No delivered sales yet'}</p><span className="mt-1 inline-block text-xs font-semibold text-cardHeader">{summary?.topCategory ? `${summary.topCategory.itemsSold.toLocaleString('en-BD')} items sold` : 'This month'}</span></div>
              <div className="rounded-xl border border-borderLight bg-surface p-4"><p className="text-xs font-medium text-gray-500">Average Order Value</p><p className="mt-1 text-base font-bold text-primary sm:text-lg">{money(summary?.stats.averageOrderValue)}</p><span className="mt-1 inline-block text-xs text-gray-500">Delivered orders this month</span></div>
            </div>
          </div>
          <div className="mt-6 flex flex-col justify-between gap-2 border-t border-borderLight pt-4 text-xs text-gray-500 sm:flex-row sm:items-center">
            <span>Last updated: {summary ? new Date(summary.generatedAt).toLocaleString('en-BD') : '—'}</span><span className="font-semibold text-cardHeader">Store Status: Active</span>
          </div>
        </section>
      </div>

      <section className="overflow-hidden rounded-2xl border border-borderLight bg-white shadow-xs">
        <div className="flex items-center justify-between border-b border-borderLight p-4 sm:p-6"><div><h2 className="font-heading text-base font-semibold text-primary sm:text-lg">Recent Orders</h2><p className="mt-1 text-xs text-gray-500">Latest five non-archived orders.</p></div><Link to="/seller/orders" className="text-xs font-medium text-cardHeader hover:underline sm:text-sm">View All</Link></div>
        {summary?.recentOrders.length ? <div className="divide-y divide-borderLight">
          {summary.recentOrders.map((order) => <article key={order.id} className="grid gap-2 p-4 transition-colors hover:bg-surface/50 sm:grid-cols-[1fr_1.2fr_auto_auto] sm:items-center sm:gap-4 sm:px-6">
            <div><p className="font-mono text-xs font-semibold text-primary">{order.orderCode}</p><p className="mt-1 text-xs text-gray-500">{new Date(order.createdAt).toLocaleString('en-BD')}</p></div>
            <div className="min-w-0"><p className="truncate text-sm font-medium text-primary">{order.customerName}</p><p className="truncate text-xs text-gray-500">{order.products.join(', ') || 'No item details'}</p></div>
            <span className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' : order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{statusLabel[order.status]}</span>
            <span className="text-sm font-bold text-primary">{money(order.totalAmount)}</span>
          </article>)}
        </div> : <div className="px-6 py-12 text-center text-sm text-gray-500">{isLoading ? 'Loading recent orders…' : error ? 'Recent orders are unavailable.' : 'No orders yet.'}</div>}
      </section>
    </div>
  );
};

export default Dashboard;
