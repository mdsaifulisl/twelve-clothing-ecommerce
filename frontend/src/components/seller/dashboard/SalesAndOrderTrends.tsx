import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { DashboardPeriod, DashboardSummary } from "../../../features/dashboard/dashboardType";

interface SalesAndOrderTrendsProps {
  period: DashboardPeriod;
  buckets: DashboardSummary["trend"]["buckets"];
  onPeriodChange: (period: DashboardPeriod) => void;
  isLoading: boolean;
}

export const SalesAndOrderTrends: React.FC<SalesAndOrderTrendsProps> = ({ period, buckets, onPeriodChange, isLoading }) => {
  const hasActivity = buckets.some((bucket) => bucket.orders > 0);

  return (
    <div className="space-y-4 font-sans">
      <div className="flex flex-col gap-3 rounded-2xl border border-borderLight bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-heading text-base font-bold text-primary">Sales &amp; Order Trends</h2>
        <div className="flex w-fit gap-1 rounded-xl border border-borderLight bg-surface p-1">
          {(["daily", "weekly", "monthly"] as DashboardPeriod[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onPeriodChange(type)}
              aria-pressed={period === type}
              className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${period === type ? "bg-cardHeader text-white shadow-xs" : "text-gray-500 hover:text-primary"}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-borderLight bg-white p-5 shadow-xs sm:p-6">
          <h3 className="mb-5 flex items-center justify-between font-heading text-sm font-bold text-primary">
            <span>Sales Trend (৳)</span><span className="text-xs font-normal uppercase text-gray-400">{period}</span>
          </h3>
          <div className="relative h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buckets} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 11 }} />
                <Tooltip formatter={(value) => [`৳ ${Number(value ?? 0).toLocaleString("en-BD")}`, "Delivered sales"]} />
                <Bar dataKey="revenue" fill="#34B38A" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
            {!hasActivity && <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-gray-400">No order activity for this period.</div>}
          </div>
        </div>

        <div className="rounded-2xl border border-borderLight bg-white p-5 shadow-xs sm:p-6">
          <h3 className="mb-5 flex items-center justify-between font-heading text-sm font-bold text-primary">
            <span>Order Trend (Count)</span><span className="text-xs font-normal uppercase text-gray-400">{period}</span>
          </h3>
          <div className="relative h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={buckets} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 11 }} allowDecimals={false} />
                <Tooltip formatter={(value) => [Number(value ?? 0), "Orders"]} />
                <Line type="monotone" dataKey="orders" stroke="#134E39" strokeWidth={2.5} dot={{ fill: "#34B38A", r: 4 }} activeDot={{ r: 6, fill: "#134E39" }} />
              </LineChart>
            </ResponsiveContainer>
            {!hasActivity && <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-gray-400">No order activity for this period.</div>}
          </div>
        </div>
      </div>
      {isLoading && <p className="text-right text-xs text-gray-400">Updating chart…</p>}
    </div>
  );
};

export default SalesAndOrderTrends;
