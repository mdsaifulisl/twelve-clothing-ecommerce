import React, { useState } from "react";
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

type FilterType = "daily" | "weekly" | "monthly";

// ১. ডেইলি ফেক ডাটা (গত ১৫ দিনের)
const dailyFakeData = [
  { month: "May 1", sales: 4200, orders: 5 },
  { month: "May 2", sales: 7800, orders: 9 },
  { month: "May 3", sales: 5100, orders: 6 },
  { month: "May 4", sales: 11200, orders: 14 },
  { month: "May 5", sales: 8900, orders: 10 },
  { month: "May 6", sales: 14500, orders: 18 },
  { month: "May 7", sales: 9300, orders: 12 },
  { month: "May 8", sales: 12400, orders: 15 },
  { month: "May 9", sales: 6700, orders: 8 },
  { month: "May 10", sales: 15800, orders: 20 },
  { month: "May 11", sales: 13200, orders: 16 },
  { month: "May 12", sales: 17500, orders: 22 },
  { month: "May 13", sales: 11000, orders: 13 },
  { month: "May 14", sales: 19200, orders: 25 },
  { month: "May 15", sales: 16400, orders: 21 },
];

// ২. উইকলি ফেক ডাটা (গত ৮ সপ্তাহের)
const weeklyFakeData = [
  { month: "7w ago", sales: 35000, orders: 45 },
  { month: "6w ago", sales: 42000, orders: 52 },
  { month: "5w ago", sales: 38000, orders: 48 },
  { month: "4w ago", sales: 55000, orders: 68 },
  { month: "3w ago", sales: 62000, orders: 75 },
  { month: "2w ago", sales: 58000, orders: 70 },
  { month: "1w ago", sales: 71000, orders: 88 },
  { month: "This Week", sales: 84000, orders: 102 },
];

// ৩. মান্থলি ফেক ডাটা (১২ মাসের)
const monthlyFakeData = [
  { month: "Jan", sales: 65000, orders: 80 },
  { month: "Feb", sales: 82000, orders: 98 },
  { month: "Mar", sales: 74000, orders: 90 },
  { month: "Apr", sales: 95000, orders: 115 },
  { month: "May", sales: 112000, orders: 140 },
  { month: "Jun", sales: 105000, orders: 130 },
  { month: "Jul", sales: 128000, orders: 155 },
  { month: "Aug", sales: 140000, orders: 170 },
  { month: "Sep", sales: 118000, orders: 145 },
  { month: "Oct", sales: 135000, orders: 160 },
  { month: "Nov", sales: 160000, orders: 195 },
  { month: "Dec", sales: 185000, orders: 230 },
];


export const SalesAndOrderTrends: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>("monthly");

  // ফিল্টার অনুযায়ী ডাটা সিলেক্ট করা
  const getChartData = () => {
    switch (filter) {
      case "daily":
        return dailyFakeData;
      case "weekly":
        return weeklyFakeData;
      case "monthly":
      default:
        return monthlyFakeData;
    }
  };

  const chartData = getChartData();

  return (
    <div className="space-y-4 font-sans">
      {/* Dynamic Filter Buttons */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-borderLight shadow-xs">
        <h2 className="text-base font-bold text-primary font-heading">
          Sales & Order Trends
        </h2>
        <div className="flex bg-surface p-1 rounded-xl gap-1 border border-borderLight">
          {(["daily", "weekly", "monthly"] as FilterType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                filter === type
                  ? "bg-cardHeader text-white shadow-xs"
                  : "text-gray-500 hover:text-primary"
              }`}
            >
              {type === "daily" ? "Daily" : type === "weekly" ? "Weekly" : "Monthly"}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-borderLight">
          <h3 className="text-sm font-bold text-primary mb-6 font-heading flex items-center justify-between">
            <span>Sales Trend (৳)</span>
            <span className="text-xs font-normal text-gray-400 uppercase">({filter})</span>
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => [`৳ ${Number(value ?? 0).toLocaleString("en-BD")}`, "Sales"]}
                  contentStyle={{ 
                    borderRadius: "12px", 
                    border: "1px solid #E5E7EB", 
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    backgroundColor: "#FFFFFF" 
                  }}
                />
                {/* Brand Header Color (#34B38A) */}
                <Bar dataKey="sales" fill="#34B38A" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Trend Line Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-borderLight">
          <h3 className="text-sm font-bold text-primary mb-6 font-heading flex items-center justify-between">
            <span>Order Trend (Count)</span>
            <span className="text-xs font-normal text-gray-400 uppercase">({filter})</span>
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => [Number(value ?? 0), "Orders"]}
                  contentStyle={{ 
                    borderRadius: "12px", 
                    border: "1px solid #E5E7EB", 
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    backgroundColor: "#FFFFFF" 
                  }}
                />
                {/* Brand Accent Color (#134E39) */}
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#134E39"
                  strokeWidth={2.5}
                  dot={{ fill: "#34B38A", r: 4 }}
                  activeDot={{ r: 6, fill: "#134E39" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAndOrderTrends;