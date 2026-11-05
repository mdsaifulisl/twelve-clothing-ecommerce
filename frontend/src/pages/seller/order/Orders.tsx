import React, { useState, useMemo, useEffect } from "react";
import { Search, Filter, Eye, Archive, ArchiveRestore, ShoppingBag, CheckCheck, RefreshCw } from "lucide-react";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { useAppDispatch } from "../../../app/hooks";
import { openModal } from "../../../features/alert/modalSlice";
import { showAlertModal } from "../../../features/alert/alertSlice";
import { useOrder } from "../../../features/order/useOrder";
import type { OrderResponse, OrderStatus } from "../../../features/order/orderType";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image?: string;
  size: string;
  color: string;
  sku: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderCode?: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: string;
  items: CartItem[];
  totalAmount: number;
  ipAddress: string;
  deviceFingerprint?: string | null;
  status: OrderStatus;
  createdAt: string;
  seenBy?: string | null; // কে সিন করেছে তার নাম ট্র্যাক করার জন্য
  archivedAt?: string | null;
}

const fromApiOrder = (order: OrderResponse): Order => ({
  id: order.id ?? order.orderCode,
  orderCode: order.orderCode,
  name: order.customerName ?? "",
  phone: order.phone ?? "",
  address: order.address ?? "",
  city: order.city ?? "outside",
  paymentMethod: order.paymentMethod,
  items: order.items.map((item) => ({
    id: item.id ?? item.productId ?? item.sku,
    title: item.title,
    price: Number(item.unitPrice),
    size: item.size,
    color: item.color ?? "",
    image: item.image ?? undefined,
    sku: item.sku,
    quantity: item.quantity,
  })),
  totalAmount: Number(order.totalAmount),
  ipAddress: order.clientIp ?? "—",
  deviceFingerprint: order.deviceFingerprint ?? null,
  status: order.status,
  createdAt: new Date(order.createdAt).toLocaleString(),
  seenBy: order.seenBy,
  archivedAt: order.archivedAt,
});

export const Orders: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sellerOrders: apiOrders, sellerOrdersLoading: loading, sellerOrdersError, mutationError, mutationId: busyOrderId, loadSellerOrders, updateStatus, updateArchive, markSeen } = useOrder();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const [archiveFilter, setArchiveFilter] = useState<"false" | "true" | "all">("false");

  // মোডাল স্টেট
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const request = loadSellerOrders({
      ...(statusFilter !== "All" ? { status: statusFilter } : {}),
      ...(searchTerm.trim() ? { search: searchTerm.trim() } : {}),
      archived: archiveFilter,
      limit: 100,
    });
    return () => request.abort();
  }, [loadSellerOrders, statusFilter, searchTerm, archiveFilter]);

  const orders = useMemo(() => apiOrders.map(fromApiOrder), [apiOrders]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updated = fromApiOrder(await updateStatus(orderId, newStatus));
      setSelectedOrder(updated);
    } catch (cause) {
      dispatch(showAlertModal({ message: String(cause), type: "error", isToast: true }));
    }
  };

  const handleArchiveOrder = async (order: Order) => {
    const archived = !order.archivedAt;
    if (!window.confirm(archived ? "Archive this order? Its records will be retained." : "Restore this order from archive?")) return;
    dispatch(openModal({
      title: archived ? "Archive order" : "Restore order",
      message: archived ? "This order will be archived while its data and history are retained." : "Restore this order from the archive?",
      onConfirm: async () => {
        try {
          await updateArchive(order.id, archived);
          if (selectedOrder?.id === order.id) setIsModalOpen(false);
          loadSellerOrders({ ...(statusFilter !== "All" ? { status: statusFilter } : {}), ...(searchTerm.trim() ? { search: searchTerm.trim() } : {}), archived: archiveFilter, limit: 100 });
          dispatch(showAlertModal({ message: archived ? "Order archived." : "Order restored.", type: "success", isToast: true }));
        } catch (cause) {
          dispatch(showAlertModal({ message: String(cause), type: "error", isToast: true }));
        }
      },
    }));
  };

  // ভিউ ডিটেইলস এবং "Seen By" আপডেট করার হ্যান্ডলার
  const handleViewDetails = async (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    if (!order.seenBy) {
      try {
        const seenOrder = fromApiOrder(await markSeen(order.id));
        setSelectedOrder(seenOrder);
      } catch (cause) {
        dispatch(showAlertModal({ message: String(cause), type: "error", isToast: true }));
      }
    }
  };

  const handleRefreshOrders = () => {
    void loadSellerOrders({
      ...(statusFilter !== "All" ? { status: statusFilter } : {}),
      ...(searchTerm.trim() ? { search: searchTerm.trim() } : {}),
      archived: archiveFilter,
      limit: 100,
    });
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        (order.orderCode ?? order.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        <button
          type="button"
          onClick={handleRefreshOrders}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-borderLight bg-white px-4 py-2.5 text-sm font-semibold text-primary shadow-xs transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Refresh orders"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Refreshing…" : "Refresh"}</span>
        </button>
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
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "All")}
            className="w-full sm:w-48 bg-surface border border-borderLight text-sm text-gray-700 py-2 px-3 rounded-xl outline-none focus:border-cardHeader transition-colors cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <select value={archiveFilter} onChange={(e) => setArchiveFilter(e.target.value as "false" | "true" | "all")} className="w-full sm:w-40 bg-surface border border-borderLight text-sm text-gray-700 py-2 px-3 rounded-xl outline-none focus:border-cardHeader transition-colors cursor-pointer">
            <option value="false">Active Orders</option><option value="true">Archived Orders</option><option value="all">All Orders</option>
          </select>
        </div>
      </div>

      {(sellerOrdersError || mutationError) && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{sellerOrdersError || mutationError}</div>}

      {/* MOBILE VIEW: কার্ড লেআউট */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {loading ? <div className="bg-white p-8 text-center rounded-2xl border border-borderLight text-gray-400 text-sm">Loading orders…</div> : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-4 rounded-2xl border border-borderLight shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-primary">
                  {order.orderCode ?? order.id}
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
                    order.status === "DELIVERED"
                      ? "bg-green-100 text-green-700"
                      : order.status === "PROCESSING"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                  }`}
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
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
                    disabled={busyOrderId === order.id}
                    onClick={() => handleArchiveOrder(order)}
                    className="p-1.5 text-gray-500 hover:text-cardHeader hover:bg-cardHeader/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {order.archivedAt ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
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
        {loading ? (
          <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">Loading orders…</td></tr>
        ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-surface/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <span className="font-bold text-primary block">
                        {order.orderCode ?? order.id}
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
                          order.status === "DELIVERED"
                            ? "bg-green-50 text-green-700"
                            : order.status === "PROCESSING"
                              ? "bg-blue-50 text-blue-700"
                              : order.status === "PENDING"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-red-50 text-red-700"
                        }`}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
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
                          title={order.archivedAt ? "Unarchive Order" : "Archive Order"}
                          disabled={busyOrderId === order.id}
                          onClick={() => handleArchiveOrder(order)}
                          className="p-1.5 text-gray-500 hover:text-cardHeader hover:bg-cardHeader/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {order.archivedAt ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
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
          void handleStatusChange(orderId, newStatus);
        }}
      />
    </div>
  );
};

export default Orders;

