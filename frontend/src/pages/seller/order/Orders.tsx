import React, { useState, useMemo } from "react";
import { Search, Filter, Eye, Trash2, ShoppingBag, CheckCheck } from "lucide-react";
import { OrderDetailsModal } from "./OrderDetailsModal";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  size: string;
  color: string;
  sku: string;
  quantity: number;
}

export interface Order {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: string;
  items: CartItem[];
  totalAmount: number;
  ipAddress: string;
  status: "Pending" | "Processing" | "Delivered" | "Cancelled";
  createdAt: string;
  seenBy?: string | null; // কে সিন করেছে তার নাম ট্র্যাক করার জন্য
}

const INITIAL_ORDERS: Order[] = [
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

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // মোডাল স্টেট
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // স্ট্যাটাস পরিবর্তনের হ্যান্ডলার
  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId ? { ...ord, status: newStatus } : ord,
      ),
    );
  };

  // অর্ডার ডিলিট হ্যান্ডলার
  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
    }
  };

  // ভিউ ডিটেইলস এবং "Seen By" আপডেট করার হ্যান্ডলার
  const handleViewDetails = (order: Order) => {
    // ফেক অ্যাডমিন নাম (ভবিষ্যতে আপনার লগইন করা ইউজারের নাম বা আইডি এখানে বসবে)
    const currentAdminName = "Sakib (Moderator)"; 

    setOrders((prev) =>
      prev.map((ord) => {
        // যদি অর্ডারটি আগে কেউ না দেখে থাকে, তবে বর্তমান ইউজারের নাম সেট করে দেবো
        if (ord.id === order.id && !ord.seenBy) {
          return { ...ord, seenBy: currentAdminName };
        }
        return ord;
      })
    );

    // সিলেক্টেড অর্ডারেও সিন স্টেট আপডেট করে মোডাল ওপেন করা
    const updatedOrder = {
      ...order,
      seenBy: order.seenBy || currentAdminName,
    };

    setSelectedOrder(updatedOrder);
    setIsModalOpen(true);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.includes(searchTerm) ||
        order.ipAddress.includes(searchTerm);

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  return (
    <div className="space-y-6 font-sans pb-10">
      {/* পেজ হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">
            Orders Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Monitor customer purchases, delivery status, and IP tracking.
          </p>
        </div>
      </div>

      {/* সার্চ ও ফিল্টার বার */}
      <div className="bg-white p-4 rounded-2xl border border-borderLight shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Order ID, Name, Phone, IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none text-primary focus:border-cardHeader transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 bg-surface border border-borderLight text-sm text-gray-700 py-2 px-3 rounded-xl outline-none focus:border-cardHeader transition-colors cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* MOBILE VIEW: কার্ড লেআউট */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-4 rounded-2xl border border-borderLight shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-primary">
                  {order.id}
                </span>
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(
                      order.id,
                      e.target.value as Order["status"],
                    )
                  }
                  className={`text-xs font-semibold px-2 py-1 rounded-lg outline-none cursor-pointer ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Processing"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                  }`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="space-y-1">
                <h4 className="font-semibold text-primary text-sm">
                  {order.name}
                </h4>
                <p className="text-xs text-gray-500">
                  {order.phone} •{" "}
                  <span className="uppercase">{order.city}</span>
                </p>
                {/* কে সিন করেছে তার স্ট্যাটাস */}
                <div className="pt-1">
                  {order.seenBy ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-green-600 font-medium">
                      <CheckCheck className="w-3.5 h-3.5" /> Seen by {order.seenBy}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 font-medium">
                      Unseen
                    </span>
                  )}
                </div>
              </div>

              {/* অ্যাকশন বাটনসমূহ */}
              <div className="flex items-center justify-between pt-2 border-t border-borderLight">
                <span className="font-bold text-primary text-sm">
                  ৳{order.totalAmount.toLocaleString("en-BD")}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="p-1.5 text-gray-500 hover:text-cardHeader hover:bg-cardHeader/10 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium"
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 text-center rounded-2xl border border-borderLight text-gray-400 text-sm">
            No orders found.
          </div>
        )}
      </div>

      {/* DESKTOP VIEW: টেবিল লেআউট */}
      <div className="hidden md:block bg-white rounded-2xl border border-borderLight shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface text-gray-500 text-xs uppercase tracking-wider border-b border-borderLight">
                <th className="py-4 px-6">Order ID & Date</th>
                <th className="py-4 px-6">Customer Info</th>
                <th className="py-4 px-6">Items & Qty</th>
                <th className="py-4 px-6">Total Amount</th>
                <th className="py-4 px-6">Status / Seen</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLight text-sm text-gray-700">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-surface/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <span className="font-bold text-primary block">
                        {order.id}
                      </span>
                      <span className="text-xs text-gray-400">
                        {order.createdAt}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-semibold text-primary block">
                        {order.name}
                      </span>
                      <span className="text-xs text-gray-500 block">
                        {order.phone}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="text-xs text-gray-600 flex items-center gap-1.5"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-cardHeader shrink-0" />
                            <span className="truncate max-w-[180px]">
                              {item.title}
                            </span>
                            <span className="font-semibold text-primary">
                              (x{item.quantity})
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-6 font-bold text-primary">
                      ৳ {order.totalAmount.toLocaleString("en-BD")}
                    </td>

                    <td className="py-4 px-6 space-y-1.5">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(
                            order.id,
                            e.target.value as Order["status"],
                          )
                        }
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl outline-none cursor-pointer border border-borderLight shadow-xs ${
                          order.status === "Delivered"
                            ? "bg-green-50 text-green-700"
                            : order.status === "Processing"
                              ? "bg-blue-50 text-blue-700"
                              : order.status === "Pending"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-red-50 text-red-700"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      {/* সিন বাই স্ট্যাটাস ব্যাজ */}
                      <div>
                        {order.seenBy ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-green-600 font-medium">
                            <CheckCheck className="w-3.5 h-3.5" /> Seen by {order.seenBy}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 w-fit">
                            Unseen
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          title="View Order Details"
                          onClick={() => handleViewDetails(order)}
                          className="p-1.5 text-gray-500 hover:text-cardHeader hover:bg-cardHeader/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          title="Delete Order"
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-gray-400 text-sm"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* অর্ডার ডিটেইলস দেখার মোডাল */}
      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onStatusChange={(orderId, newStatus) => {
          handleStatusChange(orderId, newStatus);
          if (selectedOrder) {
            setSelectedOrder({ ...selectedOrder, status: newStatus });
          }
        }}
      />
    </div>
  );
};

export default Orders;