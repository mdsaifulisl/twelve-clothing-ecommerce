import React, { useState } from 'react';
import { useCart } from '../../../features/cart/useCart';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, CheckCircle2, MapPin, Phone, User, Home, CreditCard } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { items, totalPrice, emptyCart } = useCart();
  // const navigate = useNavigate();

  // ফর্ম স্টেট
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'dhaka', 
    paymentMethod: 'cod', 
  });  

  const [orderPlaced, setOrderPlaced] = useState(false);

  // ডেলিভারি চার্জ নির্ধারণ (ঢাকা সিটির ভেতরে ৮০ টাকা, বাইরে ১৫০ টাকা)
  const deliveryCharge = formData.city === 'dhaka' ? 80 : 150;
  const grandTotal = totalPrice + (items.length > 0 ? deliveryCharge : 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('আপনার কার্ট খালি রয়েছে!');
      return;
    }

    // অর্ডার প্লেস করার লজিক (API Call)
    console.log('Order Placed Details:', { ...formData, items, grandTotal });
    
    setOrderPlaced(true);
    emptyCart(); // কার্ট খালি করে দেওয়া
  };

  // অর্ডার সফল হলে সাকসেস ভিউ দেখাবে
  if (orderPlaced) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-surface px-4 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-borderLight max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-2xl font-bold font-heading text-primary">অর্ডার সফল হয়েছে!</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            ধন্যবাদ! আপনার পাঞ্জাবি অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। খুব শীঘ্রই আমাদের প্রতিনিধি আপনার নাম্বারে যোগাযোগ করবেন।
          </p>
          <div className="pt-4">
            <Link
              to="/"
              className="inline-block w-full py-3 bg-cardHeader text-white font-semibold rounded-xl hover:bg-opacity-90 transition-all shadow-md"
            >
              হোমপেজে ফিরে যান
            </Link>
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
            <ArrowLeft size={18} /> কেনাকাটা চালিয়ে যান
          </Link>
          <h1 className="text-2xl font-bold font-heading text-primary">চেকআউট ও অর্ডার কনফার্মেশন</h1>
          <div /> {/* spacing */}
        </div>

        <form onSubmit={handleOrderSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Side: Shipping Information */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-borderLight space-y-6">
              <h2 className="text-lg font-bold font-heading text-primary border-b pb-3 flex items-center gap-2">
                <MapPin size={20} className="text-cardHeader" /> ডেলিভারি তথ্য
              </h2>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1.5">আপনার নাম *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="পুরо নাম লিখুন"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-borderLight bg-surface text-sm focus:outline-none focus:border-cardHeader transition-colors"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1.5">মোবাইল নম্বর *</label>
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
                  <label className="block text-xs font-semibold text-primary mb-1.5">ডেলিভারি এলাকা *</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-borderLight bg-surface text-sm focus:outline-none focus:border-cardHeader transition-colors"
                  >
                    <option value="dhaka">ঢাকা সিটি (ডেলিভারি চার্জ: ৳ ৮০)</option>
                    <option value="outside">ঢাকার বাইরে (ডেলিভারি চার্জ: ৳ ১৫০)</option>
                  </select>
                </div>

                {/* Full Address */}
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1.5">সম্পূর্ণ ঠিকানা (বাসা/রোড/এলাকা) *</label>
                  <div className="relative">
                    <Home className="absolute left-3 top-3 text-gray-400" size={18} />
                    <textarea
                      name="address"
                      required
                      rows={3}
                      placeholder="আপনার বিস্তারিত ঠিকানা লিখুন..."
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
                <CreditCard size={20} className="text-cardHeader" /> পেমেন্ট মাধ্যম
              </h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 rounded-xl border border-borderLight bg-surface cursor-pointer hover:border-cardHeader transition-all">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="text-cardHeader focus:ring-cardHeader"
                  />
                  <div>
                    <span className="block text-sm font-bold text-primary">ক্যাশ অন ডেলিভারি (COD)</span>
                    <span className="text-xs text-gray-500">পণ্য হাতে পেয়ে পেমেন্ট করুন।</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 rounded-xl border border-borderLight bg-surface cursor-pointer hover:border-cardHeader transition-all">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === 'online'}
                    onChange={handleInputChange}
                    className="text-cardHeader focus:ring-cardHeader"
                  />
                  <div>
                    <span className="block text-sm font-bold text-primary">বিকাশ / নগদ / অনলাইন পেমেন্ট</span>
                    <span className="text-xs text-gray-500">অনলাইনে পেমেন্ট করে অর্ডার কনফার্ম করুন।</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-borderLight space-y-6 sticky top-24">
              <h2 className="text-lg font-bold font-heading text-primary border-b pb-3 flex items-center gap-2">
                <ShoppingBag size={20} className="text-cardHeader" /> অর্ডারের সামারি ({items.length})
              </h2>

              {/* Items List */}
              <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
                {items.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-6">আপনার কার্টে কোনো পণ্য নেই।</p>
                ) : (
                  items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex items-center justify-between gap-3 text-sm">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-lg border" />
                        <div>
                          <h4 className="font-semibold text-primary line-clamp-1">{item.title}</h4>
                          <span className="text-xs text-gray-500">সাইজ: {item.size} | পিস: {item.quantity}</span>
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
                  <span>সাবটোটাল</span>
                  <span className="font-semibold text-primary">৳ {totalPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="font-semibold text-primary">৳ {deliveryCharge}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-primary border-t pt-3">
                  <span>সর্বমোট প্রাইজ</span>
                  <span className="text-cardHeader text-xl">৳ {grandTotal}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={items.length === 0}
                className="w-full py-3.5 bg-cardHeader text-white font-semibold rounded-xl hover:bg-opacity-90 disabled:opacity-50 transition-all shadow-md text-base"
              >
                অর্ডার কনফার্ম করুন
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};