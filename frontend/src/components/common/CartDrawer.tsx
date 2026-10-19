import React from 'react';
import { useCart } from '../../features/cart/useCart';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    totalPrice,
    totalQuantity,
    closeCart,
    changeQuantity,
    removeItem,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-4 sm:px-6 bg-surface border-b border-borderLight flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-cardHeader" size={22} />
              <h2 className="text-lg font-bold font-heading text-primary">
                আপনার কার্ট ({totalQuantity})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-gray-500 hover:text-red-600 rounded-full transition-colors"
            >
              <X size={22} />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-3">
                <ShoppingBag size={48} className="text-gray-300" />
                <p className="text-base font-medium">আপনার কার্ট খালি!</p>
                <button
                  onClick={closeCart}
                  className="px-4 py-2 bg-cardHeader text-white text-xs font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  কেনাকাটা করুন
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex gap-4 p-3 bg-surface rounded-xl border border-borderLight relative group"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg border border-borderLight"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-heading font-semibold text-sm text-primary line-clamp-1">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id, item.size)}
                          className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded text-[11px] font-medium">
                        সাইজ: {item.size}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-cardHeader text-sm">
                        ৳ {item.price * item.quantity}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-borderLight rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => changeQuantity(item.id, item.size, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-primary">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => changeQuantity(item.id, item.size, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer / Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 bg-surface border-t border-borderLight space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">মোট হিসাব:</span>
                <span className="font-bold text-xl text-primary">৳ {totalPrice}</span>
              </div>
              
              <Link
                to="/checkout"
                onClick={closeCart}
                className="w-full py-3 bg-cardHeader text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-md"
              >
                অর্ডার সম্পন্ন করুন <ArrowRight size={18} />
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};