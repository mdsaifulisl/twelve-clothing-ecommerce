import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, ShoppingBag, User, MapPin, Phone, CreditCard, Globe, Calendar, RefreshCw, Fingerprint, Copy, Search } from "lucide-react";
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
  const [copiedFingerprint, setCopiedFingerprint] = useState(false);

  useEffect(() => { setCopiedFingerprint(false); }, [order?.id, order?.deviceFingerprint]);

  const copyFingerprint = async () => {
    if (!order?.deviceFingerprint) return;
    try {
      await navigator.clipboard.writeText(order.deviceFingerprint);
      setCopiedFingerprint(true);
      window.setTimeout(() => setCopiedFingerprint(false), 1800);
    } catch {
      setCopiedFingerprint(false);
    }
  };

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
          <div>
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
                order.status === "DELIVERED"
                  ? "bg-green-100 text-green-700 border-green-200"
                  : order.status === "PROCESSING"
                  ? "bg-blue-100 text-blue-700 border-blue-200"
                  : order.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                  : "bg-red-100 text-red-700 border-red-200"
              }`}
            >
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          </div>

          {/* Customer and delivery details appear above the ordered items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-surface rounded-2xl border border-borderLight">
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1.5"><User className="w-4 h-4 text-cardHeader" /> Customer Info</h3>
              <div><p className="text-sm font-semibold text-primary">{order.name}</p><p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" /> {order.phone}</p></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1.5"><MapPin className="w-4 h-4 text-cardHeader" /> Delivery Address</h3>
              <div><p className="text-xs text-primary font-medium">{order.address}</p><p className="text-xs text-gray-500 uppercase font-semibold mt-0.5">{order.city}</p></div>
            </div>
          </div>

          {/* Ordered items */}
          <div>
            <h3 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-cardHeader" /> Ordered Items ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-3 rounded-2xl border border-borderLight bg-white p-4 sm:flex-row sm:items-center sm:gap-4">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="h-32 w-full rounded-xl border border-borderLight object-cover sm:h-16 sm:w-16 sm:shrink-0" />
                  ) : (
                    <div className="flex h-32 w-full items-center justify-center rounded-xl border border-borderLight bg-surface text-gray-400 sm:h-16 sm:w-16 sm:shrink-0" aria-label="Product image unavailable"><ShoppingBag className="h-5 w-5" /></div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-primary sm:truncate">{item.title}</h4>
                    <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-gray-500 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
                      <span>SKU: <span className="font-mono font-medium text-gray-700">{item.sku}</span></span>
                      <span>Color: <span className="font-semibold text-gray-700">{item.color}</span></span>
                      <span>Size: <span className="font-semibold text-gray-700">{item.size}</span></span>
                    </div>
                    <div className="mt-3 flex items-center justify-between sm:mt-1 sm:block sm:text-right">
                      <p className="text-sm font-bold text-primary">৳ {(item.price * item.quantity).toLocaleString("en-BD")}</p>
                      <p className="text-xs text-gray-400 sm:mt-0.5">Qty: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0 rounded-2xl border border-borderLight bg-white p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-xs font-medium text-gray-400"><Fingerprint className="h-3.5 w-3.5" /> Browser Device Identifier</p>
                {order.deviceFingerprint ? <code title={order.deviceFingerprint} className="mt-1 block truncate text-xs font-semibold text-primary">{order.deviceFingerprint.slice(0, 12).toUpperCase()}</code> : <p className="mt-1 text-xs text-gray-500">Not recorded</p>}
              </div>
              {order.deviceFingerprint && <div className="flex shrink-0 gap-2">
                <button type="button" onClick={() => void copyFingerprint()} className="inline-flex items-center gap-1.5 rounded-lg border border-borderLight px-3 py-2 text-xs font-semibold text-primary hover:bg-surface"><Copy className="h-3.5 w-3.5" />{copiedFingerprint ? 'Copied' : 'Copy'}</button>
                <Link to={`/seller/customers?search=${encodeURIComponent(order.deviceFingerprint)}`} onClick={onClose} className="inline-flex items-center gap-1.5 rounded-lg bg-cardHeader px-3 py-2 text-xs font-semibold text-white hover:bg-cardAccent"><Search className="h-3.5 w-3.5" />Find customer</Link>
              </div>}
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

        </div>

        {/* ফুটার */}
        <div className="p-4 border-t border-borderLight flex items-center justify-between gap-4 sticky bottom-0 bg-white">
          <div>
            <span className="block text-xs font-medium text-gray-500">Total Bill Amount</span>
            <span className="text-lg font-bold text-primary font-heading">৳ {order.totalAmount.toLocaleString("en-BD")}</span>
          </div>
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
