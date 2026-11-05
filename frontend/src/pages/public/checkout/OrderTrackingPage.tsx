import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { OrderStatus } from '../../../features/order/orderType';
import { useOrder } from '../../../features/order/useOrder';

const labels: Record<OrderStatus, string> = { PENDING: 'Pending', PROCESSING: 'Processing', DELIVERED: 'Delivered', CANCELLED: 'Cancelled' };
const money = (value: string) => Number(value).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const OrderTrackingPage = () => {
  const { trackedOrder: order, isLookingUpOrder: loading, lookupError: error, lookupErrorStatus, lookupOrder, resetTrackedOrder } = useOrder();
  const [orderCode, setOrderCode] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => { resetTrackedOrder(); }, [resetTrackedOrder]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await lookupOrder(orderCode, phone);
    } catch { /* Lookup result and error are retained in Redux for the page states below. */ }
  };

  const displayError = lookupErrorStatus === 429
    ? 'Too many attempts. Please try again in a few minutes.'
    : lookupErrorStatus === 400 || lookupErrorStatus === 404
      ? 'The Order Code or phone number is incorrect. Check your details and try again.'
      : lookupErrorStatus === 0
        ? 'Unable to connect to the server. Check your internet connection and try again.'
        : error ? 'Could not find your order. Please try again later.' : '';
  const rateLimited = lookupErrorStatus === 429;

  return <main className="min-h-[75vh] bg-surface px-4 py-12">
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="text-center"><h1 className="text-3xl font-bold text-primary">Track Your Order</h1><p className="mt-2 text-sm text-gray-600">Enter your Order Code and the phone number used at checkout.</p></header>
      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-borderLight bg-white p-6 shadow-sm">
        <label className="block text-sm font-medium text-primary">Order Code<input required value={orderCode} onChange={(event) => setOrderCode(event.target.value)} placeholder="RK-0123456789ABCDEF01234567" className="mt-1 w-full rounded-xl border border-borderLight px-4 py-3 font-mono uppercase outline-none focus:border-cardHeader" /></label>
        <label className="block text-sm font-medium text-primary">Phone Number<input required type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="01XXXXXXXXX or +8801XXXXXXXXX" className="mt-1 w-full rounded-xl border border-borderLight px-4 py-3 outline-none focus:border-cardHeader" /></label>
        {displayError && <div role="alert" aria-live="polite" className={`rounded-xl border p-3 text-sm ${rateLimited ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-red-200 bg-red-50 text-red-700'}`}>{displayError}</div>}
        <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-cardHeader px-4 py-3 font-semibold text-white disabled:opacity-60"><Search className="h-4 w-4" />{loading ? 'Searching…' : 'Find Order'}</button>
      </form>

      {order && <section aria-live="polite" className="space-y-4 rounded-2xl border border-borderLight bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-2"><div><p className="text-xs text-gray-500">Order Code</p><h2 className="font-mono text-lg font-bold text-primary">{order.orderCode}</h2></div><span className="rounded-full bg-surface px-3 py-1 text-sm font-semibold">{labels[order.status]}</span></div>
        <p className="text-sm text-gray-600">Order Date: {new Date(order.createdAt).toLocaleString('en-BD')}</p>
        <div className="divide-y divide-borderLight border-y">{order.items.map((item, index) => <div key={item.id ?? `${item.sku}-${index}`} className="flex justify-between gap-4 py-3 text-sm"><span>{item.title} · {item.size}{item.color ? ` · ${item.color}` : ''} · ×{item.quantity}</span><span className="whitespace-nowrap">৳ {money(item.lineTotal)}</span></div>)}</div>
        <div className="space-y-1 text-sm"><p className="flex justify-between"><span>Subtotal</span><span>৳ {money(order.subtotal)}</span></p><p className="flex justify-between"><span>Delivery</span><span>৳ {money(order.deliveryCharge)}</span></p><p className="flex justify-between border-t pt-2 text-base font-bold"><span>Total</span><span>৳ {money(order.totalAmount)}</span></p></div>
        {order.paymentMethod === 'online' && <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">Online payment was selected. Payment verification is not available here.</p>}
      </section>}
      <p className="text-center text-sm"><Link to="/" className="font-semibold text-cardHeader hover:underline">Back to Home</Link></p>
    </div>
  </main>;
};

export default OrderTrackingPage;
