import React from 'react';
import { 
  ShoppingBag, 
  Users, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  PackageCheck, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { SalesAndOrderTrends } from '../../../components/seller/dashboard/SalesAndOrderTrends';

export const Dashboard: React.FC = () => {
  // ১. স্ট্যাটাস কার্ডের ডাটা
  const stats = [
    { 
      title: 'Total Revenue', 
      value: '৳ ১,২৪,৫০০', 
      change: '+12.5%', 
      icon: DollarSign, 
      bg: 'bg-cardHeader' 
    },
    { 
      title: 'Total Orders', 
      value: '৩৫০+', 
      change: '+8.2%', 
      icon: ShoppingBag, 
      bg: 'bg-cardBody' 
    },
    { 
      title: 'Total Customers', 
      value: '১,২০ জন', 
      change: '+5.4%', 
      icon: Users, 
      bg: 'bg-cardAccent' 
    },
    { 
      title: 'Growth Rate', 
      value: '১৫.৮%', 
      change: '+2.1%', 
      icon: TrendingUp, 
      bg: 'bg-primary' 
    },
  ];

  // ২. সাম্প্রতিক অর্ডারের ডাটা
  const recentOrders = [
    { id: '#TC-901', customer: 'রহিম আহমেদ', product: 'প্রিমিয়াম পাঞ্জাবি', amount: '৳ ২,৫০০', status: 'Pending', date: '১৬ মে, ২০২৬' },
    { id: '#TC-902', customer: 'করিম উল্লাহ', product: 'ক্যাজুয়াল টি-শার্ট', amount: '৳ ৯৯০', status: 'Delivered', date: '১৫ মে, ২০২৬' },
    { id: '#TC-903', customer: 'সাদিয়া ইসলাম', product: 'পাঞ্জাবি কম্বো প্যাক', amount: '৳ ৪,২০০', status: 'Processing', date: '১৫ মে, ২০২৬' },
    { id: '#TC-904', customer: 'আরিফ হোসেন', product: 'সামার টি-শার্ট', amount: '৳ ১,১৫০', status: 'Cancelled', date: '১৪ মে, ২০২৬' },
  ];

  return (
    <div className="space-y-6 pb-10 font-sans">
      {/* পেজ হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-primary">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Welcome back, here is what's happening with Twelve Clothing today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-full sm:w-auto px-4 py-2.5 bg-cardHeader text-white text-sm font-medium rounded-xl hover:bg-cardAccent transition-colors shadow-xs cursor-pointer text-center">
            Download Report
          </button>
        </div>
      </div>

      {/* ১. স্ট্যাটাস কার্ডস (DashboardStats) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx} 
              className="bg-white p-5 sm:p-6 rounded-2xl border border-borderLight shadow-xs flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.title}</p>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-primary mt-1">
                  {stat.value}
                </h3>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 mt-2">
                  <ArrowUpRight className="w-3.5 h-3.5" /> {stat.change} from last month
                </span>
              </div>
              <div className={`p-3.5 sm:p-4 rounded-xl text-white ${stat.bg} shadow-sm shrink-0`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ২. সেলস ও অর্ডার ট্রেন্ড চার্টস */}
      <SalesAndOrderTrends />

      {/* ৩. অর্ডার স্ট্যাটাস সামারি ও কুইক ইনফো গ্রিড */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* অর্ডার স্ট্যাটাস সামারি */}
        <div className="lg:col-span-1 bg-white p-5 sm:p-6 rounded-2xl border border-borderLight shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-base sm:text-lg font-semibold text-primary mb-4">
              Order Status Summary
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between p-3 bg-surface rounded-xl border border-borderLight">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 text-yellow-700 rounded-lg shrink-0">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Pending Orders</span>
                </div>
                <span className="font-bold text-primary text-sm sm:text-base">24</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-surface rounded-xl border border-borderLight">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-lg shrink-0">
                    <PackageCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Processing</span>
                </div>
                <span className="font-bold text-primary text-sm sm:text-base">12</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-surface rounded-xl border border-borderLight">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 text-red-700 rounded-lg shrink-0">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Cancelled</span>
                </div>
                <span className="font-bold text-primary text-sm sm:text-base">3</span>
              </div>
            </div>
          </div>
          <button className="w-full mt-6 py-2.5 bg-surface text-cardAccent font-medium text-sm rounded-xl border border-borderLight hover:bg-cardHeader/10 transition-colors cursor-pointer">
            View All Orders
          </button>
        </div>

        {/* টপ সেলিং হাইলাইটস */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-borderLight shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-base sm:text-lg font-semibold text-primary mb-1">
              Top Selling Highlights
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-5">
              Quick overview of your top performing product category this month.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-surface rounded-xl border border-borderLight">
                <p className="text-xs text-gray-500 font-medium">Top Category</p>
                <p className="text-base sm:text-lg font-bold text-primary mt-1">Punjabi Collection</p>
                <span className="text-xs text-cardHeader font-semibold mt-1 inline-block">142 items sold</span>
              </div>
              <div className="p-4 bg-surface rounded-xl border border-borderLight">
                <p className="text-xs text-gray-500 font-medium">Average Order Value</p>
                <p className="text-base sm:text-lg font-bold text-primary mt-1">৳ ২,৪৫০</p>
                <span className="text-xs text-green-600 font-semibold mt-1 inline-block">+5.2% vs last month</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-borderLight flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-500">
            <span>Last updated: Just now</span>
            <span className="text-cardHeader font-semibold">Store Status: Active</span>
          </div>
        </div>
      </div>

      {/* ৪. সাম্প্রতিক অর্ডার সেকশন */}
      <div className="bg-white rounded-2xl border border-borderLight shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-borderLight flex justify-between items-center">
          <h3 className="font-heading text-base sm:text-lg font-semibold text-primary">
            Recent Orders
          </h3>
          <button className="text-xs sm:text-sm font-medium text-cardHeader hover:underline cursor-pointer">
            View All
          </button>
        </div>

        {/* MOBILE VIEW: কার্ড লেআউট */}
        <div className="divide-y divide-borderLight md:hidden">
          {recentOrders.map((order, i) => (
            <div key={i} className="p-4 space-y-2 hover:bg-surface/50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-primary text-xs font-mono">{order.id}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                  order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                  order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {order.status}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-medium text-primary">{order.customer}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{order.product}</p>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-gray-400">{order.date}</span>
                <span className="font-bold text-primary text-sm">{order.amount}</span>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP VIEW: টেবিল লেআউট */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface text-gray-500 text-xs uppercase tracking-wider border-b border-borderLight">
                <th className="py-3 px-6">Order ID</th>
                <th className="py-3 px-6">Customer Name</th>
                <th className="py-3 px-6">Product</th>
                <th className="py-3 px-6">Amount</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLight text-sm text-gray-700">
              {recentOrders.map((order, i) => (
                <tr key={i} className="hover:bg-surface/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-primary">{order.id}</td>
                  <td className="py-4 px-6">{order.customer}</td>
                  <td className="py-4 px-6">{order.product}</td>
                  <td className="py-4 px-6 font-bold">{order.amount}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-500 text-xs">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;