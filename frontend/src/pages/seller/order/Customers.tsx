import React, { useState, useMemo } from "react";
import { Search, Filter, ShoppingBag, Phone, MapPin, User, ShieldAlert, ShieldCheck, Globe, Lock } from "lucide-react";
import type { Order } from "./Orders";

// ডামি অর্ডার ডাটা (যার থেকে কাস্টমার লিস্ট এবং IP বের হবে)
const MOCK_ORDERS: Order[] = [
  {
    id: "TC-ORD-901",
    name: "রহিম আহমেদ",
    phone: "+880 1711-223344",
    address: "House 12, Road 5, Dhanmondi",
    city: "dhaka",
    paymentMethod: "cod",
    items: [
      {
        id: "1",
        title: "Mens Maroon Panjabi",
        price: 3839,
        image: "https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?auto=format&fit=crop&q=80&w=600",
        size: "L",
        color: "MAROON",
        sku: "RA-PNJ-TW26-101-MAR",
        quantity: 1,
      },
    ],
    totalAmount: 3839,
    ipAddress: "192.168.1.15",
    status: "Pending",
    createdAt: "16 May, 2026",
    seenBy: null, // এখনো কেউ দেখেনি
  },
  {
    id: "TC-ORD-902",
    name: "করিম উল্লাহ",
    phone: "+880 1819-556677",
    address: "GEC Circle, Nasirabad",
    city: "chittagong",
    paymentMethod: "bkash",
    items: [
      {
        id: "12",
        title: "Traditional Metal Panjabi Buttons",
        price: 450,
        image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=600",
        size: "N/A",
        color: "GOLDEN",
        sku: "RA-ACC-BTN-801",
        quantity: 2,
      },
      {
        id: "10",
        title: "Womens Designer Three Piece",
        price: 4500,
        image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600",
        size: "M",
        color: "BLUE",
        sku: "RA-3PC-TW26-201-BLU",
        quantity: 1,
      },
    ],
    totalAmount: 900,
    ipAddress: "103.125.44.12",
    status: "Processing",
    createdAt: "15 May, 2026",
    seenBy: "Tanvir (Admin)", // অলরেডি একজন দেখেছে
  },
  {
    id: "TC-ORD-903",
    name: "সাদিয়া ইসলাম",
    phone: "+880 1922-889900",
    address: "Zindabazar, Ward 15",
    city: "sylhet",
    paymentMethod: "cod",
    items: [
      {
        id: "4",
        title: "Womens Designer Three Piece",
        price: 4500,
        image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600",
        size: "M",
        color: "BLUE",
        sku: "RA-3PC-TW26-201-BLU",
        quantity: 1,
      },
    ],
    totalAmount: 4050,
    ipAddress: "45.120.14.89",
    status: "Delivered",
    createdAt: "14 May, 2026",
    seenBy: null,
  },
];

export interface CustomerAggregate {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  ipAddress: string;
  isBlocked: boolean;
}

export const Customers: React.FC = () => {
  // ১. ব্লকড IP লিস্ট স্টেট (DB Table-এর প্রতিনিধিত্ব করে)
  const [blockedIPs, setBlockedIPs] = useState<string[]>(["45.112.88.99"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [ipStatusFilter, setIpStatusFilter] = useState("All");
  const [showBlockedModal, setShowBlockedModal] = useState(false);

  // ২. পদ্ধতি ১: অর্ডার টেবিল থেকে স্বয়ংক্রিয়ভাবে ইউনিক কাস্টমার এগ্রিগেশন
  const customers: CustomerAggregate[] = useMemo(() => {
    const customerMap: Record<string, CustomerAggregate> = {};

    MOCK_ORDERS.forEach((order) => {
      const phoneKey = order.phone.trim();

      if (!customerMap[phoneKey]) {
        customerMap[phoneKey] = {
          id: `CUST-${phoneKey.slice(-4)}`,
          name: order.name,
          phone: order.phone,
          email: `${phoneKey.replace(/[^0-9]/g, "")}@customer.com`, // ফেক ইমেইল
          address: order.address,
          city: order.city,
          totalOrders: 1,
          totalSpent: order.totalAmount,
          lastOrderDate: order.createdAt,
          ipAddress: order.ipAddress,
          isBlocked: blockedIPs.includes(order.ipAddress),
        };
      } else {
        customerMap[phoneKey].totalOrders += 1;
        customerMap[phoneKey].totalSpent += order.totalAmount;
        customerMap[phoneKey].isBlocked = blockedIPs.includes(customerMap[phoneKey].ipAddress);
      }
    });

    return Object.values(customerMap);
  }, [blockedIPs]);

  // সিটির ইউনিক লিস্ট
  const cities = useMemo(() => {
    const set = new Set(customers.map((c) => c.city));
    return ["All", ...Array.from(set)];
  }, [customers]);

  // IP ব্লক/আনব্লক হ্যান্ডলার
  const toggleBlockIP = (ip: string) => {
    if (blockedIPs.includes(ip)) {
      setBlockedIPs((prev) => prev.filter((item) => item !== ip));
    } else {
      if (window.confirm(`Are you sure you want to block IP: ${ip}? This will stop future orders from this IP.`)) {
        setBlockedIPs((prev) => [...prev, ip]);
      }
    }
  };

  // সার্চ ও ফিল্টারিং লজিক (IP Address সহ)
  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      const matchesSearch =
        cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cust.phone.includes(searchTerm) ||
        cust.ipAddress.includes(searchTerm) ||
        cust.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCity =
        selectedCity === "All" || cust.city.toLowerCase() === selectedCity.toLowerCase();

      const matchesIpStatus =
        ipStatusFilter === "All" ||
        (ipStatusFilter === "Blocked" && cust.isBlocked) ||
        (ipStatusFilter === "Active" && !cust.isBlocked);

      return matchesSearch && matchesCity && matchesIpStatus;
    });
  }, [customers, searchTerm, selectedCity, ipStatusFilter]);

  return (
    <div className="space-y-6 font-sans pb-10">
      {/* পেজ হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">
            Customers & IP Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Automatically generated from orders. Monitor buyers and block fake order IPs.
          </p>
        </div>
        <button
          onClick={() => setShowBlockedModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 text-xs font-bold rounded-xl hover:bg-red-100 transition-colors cursor-pointer w-full sm:w-auto"
        >
          <Lock className="w-4 h-4" />
          <span>Blocked IPs List ({blockedIPs.length})</span>
        </button>
      </div>

      {/* সার্চ এবং ফিল্টার বার */}
      <div className="bg-white p-4 rounded-2xl border border-borderLight shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* সার্চ ইনপুট (IP সার্চ সমর্থিত) */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Name, Phone, IP Address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none text-primary focus:border-cardHeader transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* IP স্ট্যাটাস ফিল্টার */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            <select
              value={ipStatusFilter}
              onChange={(e) => setIpStatusFilter(e.target.value)}
              className="w-full sm:w-36 bg-surface border border-borderLight text-sm text-gray-700 py-2 px-3 rounded-xl outline-none focus:border-cardHeader transition-colors cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Buyers</option>
              <option value="Blocked">Blocked IPs</option>
            </select>
          </div>

          {/* সিটি ফিল্টার */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full sm:w-36 bg-surface border border-borderLight text-sm text-gray-700 py-2 px-3 rounded-xl outline-none focus:border-cardHeader transition-colors cursor-pointer capitalize"
          >
            {cities.map((city, idx) => (
              <option key={idx} value={city}>
                {city === "All" ? "All Cities" : city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* MOBILE VIEW: কার্ড লেআউট */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((cust) => (
            <div
              key={cust.id}
              className={`bg-white p-4 rounded-2xl border shadow-xs space-y-3 ${
                cust.isBlocked ? "border-red-300 bg-red-50/20" : "border-borderLight"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-surface text-gray-500 rounded-md border border-borderLight">
                  {cust.id}
                </span>
                {cust.isBlocked ? (
                  <span className="text-[11px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> Blocked
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Active
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <h4 className="font-semibold text-primary text-sm flex items-center gap-1.5">
                  <User className="w-4 h-4 text-cardHeader" /> {cust.name}
                </h4>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-gray-400" /> {cust.phone}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1 font-mono">
                  <Globe className="w-3.5 h-3.5 text-gray-400" /> IP: {cust.ipAddress}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-borderLight text-xs">
                <div>
                  <span className="text-gray-400 block">Total Orders:</span>
                  <span className="font-bold text-primary flex items-center gap-1 mt-0.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-cardHeader" />
                    {cust.totalOrders} Orders
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Total Spent:</span>
                  <span className="font-bold text-primary text-sm mt-0.5 block">
                    ৳{cust.totalSpent.toLocaleString("en-BD")}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-borderLight">
                <span className="text-xs text-gray-500 uppercase font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" /> {cust.city}
                </span>
                <button
                  onClick={() => toggleBlockIP(cust.ipAddress)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    cust.isBlocked
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  {cust.isBlocked ? "Unblock IP" : "Block IP"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 text-center rounded-2xl border border-borderLight text-gray-400 text-sm">
            No customers or IP logs found matching your filter.
          </div>
        )}
      </div>

      {/* DESKTOP VIEW: টেবিল লেআউট */}
      <div className="hidden md:block bg-white rounded-2xl border border-borderLight shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface text-gray-500 text-xs uppercase tracking-wider border-b border-borderLight">
                <th className="py-4 px-6">Customer & ID</th>
                <th className="py-4 px-6">Phone & IP Address</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6">Orders Count</th>
                <th className="py-4 px-6">Total Spent</th>
                <th className="py-4 px-6 text-right">IP Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLight text-sm text-gray-700">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    className={`hover:bg-surface/50 transition-colors ${
                      cust.isBlocked ? "bg-red-50/30" : ""
                    }`}
                  >
                    <td className="py-4 px-6">
                      <span className="font-semibold text-primary block">{cust.name}</span>
                      <span className="text-xs font-mono text-gray-400">{cust.id}</span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-xs text-gray-700 block font-semibold">{cust.phone}</span>
                      <span className="text-xs font-mono text-gray-500 flex items-center gap-1 mt-0.5">
                        <Globe className="w-3 h-3 text-gray-400" /> {cust.ipAddress}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-xs font-semibold text-primary uppercase block">{cust.city}</span>
                      <span className="text-xs text-gray-400 truncate max-w-[180px] block">{cust.address}</span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface border border-borderLight text-xs font-semibold rounded-lg text-primary">
                        <ShoppingBag className="w-3.5 h-3.5 text-cardHeader" />
                        {cust.totalOrders} Orders
                      </span>
                    </td>

                    <td className="py-4 px-6 font-bold text-primary">
                      ৳ {cust.totalSpent.toLocaleString("en-BD")}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => toggleBlockIP(cust.ipAddress)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer border shadow-2xs ${
                          cust.isBlocked
                            ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                            : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                        }`}
                      >
                        {cust.isBlocked ? "Unblock IP" : "Block IP"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ৪. ব্লক করা IP সমূহের মোডাল (Blacklist Manager) */}
      {showBlockedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 border border-borderLight shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-borderLight pb-3">
              <h3 className="font-heading text-lg font-bold text-primary flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-600" /> Blocked IP Blacklist
              </h3>
              <button
                onClick={() => setShowBlockedModal(false)}
                className="text-gray-400 hover:text-primary text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Orders from these IP addresses are restricted from completing checkout.
            </p>

            <div className="max-h-60 overflow-y-auto divide-y divide-borderLight border border-borderLight rounded-xl">
              {blockedIPs.length > 0 ? (
                blockedIPs.map((ip, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs bg-surface">
                    <span className="font-mono font-bold text-gray-700">{ip}</span>
                    <button
                      onClick={() => toggleBlockIP(ip)}
                      className="text-red-600 hover:underline font-semibold cursor-pointer"
                    >
                      Unblock
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-gray-400">
                  No IP addresses currently blacklisted.
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowBlockedModal(false)}
                className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;