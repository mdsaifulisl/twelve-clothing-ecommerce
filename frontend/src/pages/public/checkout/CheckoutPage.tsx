/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { useCart } from '../../../features/cart/useCart';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, CheckCircle2, MapPin, Phone, User, Home, CreditCard } from 'lucide-react';
import { useAppDispatch } from '../../../app/hooks';
import { showAlertModal } from '../../../features/alert/alertSlice';
import { useOrder } from '../../../features/order/useOrder';
import { usePublicSettings } from '../../../features/settings/usePublicSettings';
import { getOrderDeviceId } from '../../../features/order/deviceIdentity';

export const CheckoutPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { createdOrder, isCreatingOrder: submitting, submitOrder, resetCreatedOrder } = useOrder();
  const { items, totalPrice, emptyCart } = useCart();
  const { settings } = usePublicSettings();
  // const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'dhaka', 
    paymentMethod: 'cod', 
  });  

  useEffect(() => { resetCreatedOrder(); }, [resetCreatedOrder]);

  const [orderPlaced, setOrderPlaced] = useState(false);

  const insideDhakaCharge = settings?.delivery.insideDhakaCharge ?? 80;
  const outsideDhakaCharge = settings?.delivery.outsideDhakaCharge ?? 150;
  const freeDeliveryThreshold = settings?.delivery.freeDeliveryThreshold ?? 5000;
  const deliveryCharge = items.length === 0 || totalPrice >= freeDeliveryThreshold
    ? 0
    : formData.city === 'dhaka' ? insideDhakaCharge : outsideDhakaCharge;
  const grandTotal = totalPrice + (items.length > 0 ? deliveryCharge : 0);
  const codEnabled = settings?.payment.codEnabled ?? true;
  const bkashEnabled = settings?.payment.bkashEnabled ?? true;
  const hasPaymentMethod = codEnabled || bkashEnabled;

  useEffect(() => {
    if (formData.paymentMethod === 'cod' && !codEnabled && bkashEnabled) {
      setFormData((current) => ({ ...current, paymentMethod: 'online' }));
    } else if (formData.paymentMethod === 'online' && !bkashEnabled && codEnabled) {
      setFormData((current) => ({ ...current, paymentMethod: 'cod' }));
    }
  }, [codEnabled, bkashEnabled, formData.paymentMethod]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      return;
    }

    try {
      await submitOrder({
        customerName: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city as 'dhaka' | 'outside',
        paymentMethod: formData.paymentMethod as 'cod' | 'online',
        deviceId: getOrderDeviceId(),
        items: items.map((item) => ({
          productId: item.id,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        })),
      });
      setOrderPlaced(true);
      emptyCart();
    } catch (error: unknown) {
      const failure = error as { status?: number; message?: string };
      const isBlocked = failure?.status === 403;
      dispatch(showAlertModal({
        title: isBlocked ? 'Order blocked' : 'Order could not be placed',
        message: isBlocked
          ? 'You have been blocked for placing a fake order.'
          : failure?.message || 'Your order could not be placed. Please try again.',
        type: 'error',
      }));
    }
  };

  // Show the success view after the order is placed
  if (orderPlaced) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-surface px-4 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-borderLight max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-2xl font-bold font-heading text-primary">Order placed successfully!</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Thank you! Your order has been received. A member of our team will contact you soon.
          </p>
          {createdOrder && <div className="rounded-xl bg-surface p-4 text-left text-sm">
            <p>Order Code: <strong className="font-mono">{createdOrder.orderCode}</strong></p>
            <p className="mt-1">Status: <strong>Pending</strong></p>
            {createdOrder.paymentMethod === 'online' && <p className="mt-2 text-amber-700">Online payment was selected. Payment has not been verified or confirmed.</p>}
          </div>}
          <div className="pt-4">
            <Link
              to="/"
              className="inline-block w-full py-3 bg-cardHeader text-white font-semibold rounded-xl hover:bg-opacity-90 transition-all shadow-md"
            >
              Return to home
            </Link>
            <Link to="/order-tracking" className="mt-3 inline-block text-sm font-semibold text-cardHeader hover:underline">Track your order</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-cardHeader transition-colors">
            <ArrowLeft size={18} /> Continue shopping
          </Link>
          <h1 className="text-2xl font-bold font-heading text-primary">Checkout &amp; Order Confirmation</h1>
          <div /> {/* spacing */}
        </div>

        <form onSubmit={handleOrderSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side: Shipping Information */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-borderLight space-y-6">
              <h2 className="text-lg font-bold font-heading text-primary border-b pb-3 flex items-center gap-2">
                <MapPin size={20} className="text-cardHeader" /> Delivery Information
              </h2>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1.5">Your Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-borderLight bg-surface text-sm focus:outline-none focus:border-cardHeader transition-colors"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1.5">Mobile Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="017xxxxxxxx"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-borderLight bg-surface text-sm focus:outline-none focus:border-cardHeader transition-colors"
                    />
                  </div>
                </div>

                {/* City Selection */}
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1.5">Delivery Area *</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-borderLight bg-surface text-sm focus:outline-none focus:border-cardHeader transition-colors"
                  >
                    <option value="dhaka">Dhaka City (Delivery charge: ৳ {insideDhakaCharge})</option>
                    <option value="outside">Outside Dhaka (Delivery charge: ৳ {outsideDhakaCharge})</option>
                  </select>
                </div>

                {/* Full Address */}
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1.5">Full Address (House/Road/Area) *</label>
                  <div className="relative">
                    <Home className="absolute left-3 top-3 text-gray-400" size={18} />
                    <textarea
                      name="address"
                      required
                      rows={3}
                      placeholder="Enter your complete delivery address..."
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-borderLight bg-surface text-sm focus:outline-none focus:border-cardHeader transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-borderLight space-y-4">
              <h2 className="text-lg font-bold font-heading text-primary border-b pb-3 flex items-center gap-2">
                <CreditCard size={20} className="text-cardHeader" /> Payment Method
              </h2>

              <div className="space-y-3">
                {!hasPaymentMethod && <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">No payment methods are currently available.</p>}
                {codEnabled && <label className="flex items-center gap-3 p-4 rounded-xl border border-borderLight bg-surface cursor-pointer hover:border-cardHeader transition-all">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="text-cardHeader focus:ring-cardHeader"
                  />
                  <div>
                    <span className="block text-sm font-bold text-primary">Cash on Delivery (COD)</span>
                    <span className="text-xs text-gray-500">Pay when your order is delivered.</span>
                  </div>
                </label>}

                {bkashEnabled && <label className="flex items-center gap-3 p-4 rounded-xl border border-borderLight bg-surface cursor-pointer hover:border-cardHeader transition-all">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === 'online'}
                    onChange={handleInputChange}
                    className="text-cardHeader focus:ring-cardHeader"
                  />
                  <div>
                    <span className="block text-sm font-bold text-primary">Manual bKash payment</span>
                    {settings?.payment.bkashNumber && <span className="block text-xs text-gray-600">bKash number: {settings.payment.bkashNumber}</span>}
                    <span className="block text-xs text-gray-500">This only selects a payment method. Payment is not verified here.</span>
                  </div>
                </label>}
              </div>
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-borderLight space-y-6 sticky top-24">
              <h2 className="text-lg font-bold font-heading text-primary border-b pb-3 flex items-center gap-2">
                <ShoppingBag size={20} className="text-cardHeader" /> Order Summary ({items.length})
              </h2>

              {/* Items List */}
              <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
                {items.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-6">Your cart is empty.</p>
                ) : (
                  items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex items-center justify-between gap-3 text-sm">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-lg border" />
                        <div>
                          <h4 className="font-semibold text-primary line-clamp-1">{item.title}</h4>
                          <span className="text-xs text-gray-500">Size: {item.size} | Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-bold text-cardHeader">৳ {item.price * item.quantity}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Cost Calculations */}
              <div className="border-t pt-4 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-primary">৳ {totalPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery charge{items.length > 0 && totalPrice >= freeDeliveryThreshold ? ` (Free on orders of ৳ ${freeDeliveryThreshold} or more)` : ""}</span>
                  <span className="font-semibold text-primary">৳ {deliveryCharge}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-primary border-t pt-3">
                  <span>Grand Total</span>
                  <span className="text-cardHeader text-xl">৳ {grandTotal}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={items.length === 0 || submitting || !hasPaymentMethod}
                className="w-full py-3.5 bg-cardHeader text-white font-semibold rounded-xl hover:bg-opacity-90 disabled:opacity-50 transition-all shadow-md text-base"
              >
                {submitting ? 'Placing your order…' : 'Place Order'}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
