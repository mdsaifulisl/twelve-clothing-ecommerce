import React from "react";
import { X, ShoppingBag, User, MapPin, Phone, CreditCard, Globe, Calendar, RefreshCw } from "lucide-react";
import type { Order } from "./Orders";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onStatusChange?: (orderId: string, newStatus: Order["status"]) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  order,
  onStatusChange,
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-borderLight shadow-xl font-sans">
        {/* মোডাল হেডার */}
        <div className="p-6 border-b border-borderLight flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-xl font-bold text-primary">
                Order Details
              </h2>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-surface text-gray-600 rounded-md border border-borderLight">
                {order.id}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Placed on {order.createdAt}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-primary rounded-xl hover:bg-surface transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* মোডাল কন্টেন্ট */}
        <div className="p-6 space-y-6">
          {/* ০. অর্ডার স্ট্যাটাস আপডেট সেকশন */}
          <div className="p-4 bg-surface rounded-2xl border border-borderLight flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-cardHeader" />
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Order Status
              </span>
            </div>
            <select
              value={order.status}
              onChange={(e) =>
                onStatusChange &&
                onStatusChange(order.id, e.target.value as Order["status"])
              }
              className={`text-xs font-bold px-3 py-2 rounded-xl outline-none cursor-pointer border border-borderLight shadow-xs transition-colors ${
                order.status === "Delivered"
                  ? "bg-green-100 text-green-700 border-green-200"
                  : order.status === "Processing"
                  ? "bg-blue-100 text-blue-700 border-blue-200"
                  : order.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                  : "bg-red-100 text-red-700 border-red-200"
              }`}
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* ১. কাস্টমার ও ডেলিভারি তথ্য */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-surface rounded-2xl border border-borderLight">
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-cardHeader" /> Customer Info
              </h3>
              <div>
                <p className="text-sm font-semibold text-primary">{order.name}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3" /> {order.phone}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cardHeader" /> Delivery Address
              </h3>
              <div>
                <p className="text-xs text-primary font-medium">{order.address}</p>
                <p className="text-xs text-gray-500 uppercase font-semibold mt-0.5">{order.city}</p>
              </div>
            </div>
          </div>

          {/* ২. পেমেন্ট ও আইপি ট্র্যাক ইনফো */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-white rounded-xl border border-borderLight flex items-center gap-3">
              <div className="p-2 bg-cardHeader/10 text-cardHeader rounded-lg">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <p className="text-gray-400 font-medium">Payment Method</p>
                <p className="font-bold text-primary uppercase mt-0.5">{order.paymentMethod}</p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-borderLight flex items-center gap-3">
              <div className="p-2 bg-cardHeader/10 text-cardHeader rounded-lg">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <p className="text-gray-400 font-medium">IP Address</p>
                <p className="font-bold text-primary font-mono mt-0.5">{order.ipAddress}</p>
              </div>
            </div>
          </div>

          {/* ৩. অর্ডার করা আইটেমগুলোর লিস্ট */}
          <div>
            <h3 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-cardHeader" /> Ordered Items ({order.items.length})
            </h3>
            <div className="border border-borderLight rounded-2xl overflow-hidden divide-y divide-borderLight">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-4 flex items-center gap-4 bg-white">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-14 h-14 rounded-xl object-cover border border-borderLight shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-primary truncate">{item.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span>SKU: <span className="font-mono text-gray-700 font-medium">{item.sku}</span></span>
                      <span>•</span>
                      <span>Color: <span className="font-semibold text-gray-700">{item.color}</span></span>
                      <span>•</span>
                      <span>Size: <span className="font-semibold text-gray-700">{item.size}</span></span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">৳ {(item.price * item.quantity).toLocaleString("en-BD")}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ৪. মোট হিসাব */}
          <div className="pt-4 border-t border-borderLight flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Total Bill Amount</span>
            <span className="text-xl font-bold text-primary font-heading">
              ৳ {order.totalAmount.toLocaleString("en-BD")}
            </span>
          </div>
        </div>

        {/* ফুটার */}
        <div className="p-4 border-t border-borderLight flex justify-end sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-surface border border-borderLight text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};