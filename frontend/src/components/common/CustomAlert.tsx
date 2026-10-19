import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { hideAlertModal } from '../../features/alert/alertSlice';

export const CustomAlert: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isOpen, message, type, title, isToast } = useAppSelector((state) => state.alert);

  // যদি টোস্ট হয়, তবে ৩ সেকেন্ড পর অটোমেটিক হাইড হয়ে যাবে
  useEffect(() => {
    if (isOpen && isToast) {
      const timer = setTimeout(() => {
        dispatch(hideAlertModal());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isToast, dispatch]);

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(hideAlertModal());
  };

  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          borderColor: 'border-green-500',
          bgToast: 'bg-green-50 border border-green-200 text-green-800',
          btnBg: 'bg-green-600 hover:bg-green-700',
          defaultTitle: 'সফল হয়েছে!',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5 text-red-600" />,
          borderColor: 'border-red-500',
          bgToast: 'bg-red-50 border border-red-200 text-red-800',
          btnBg: 'bg-red-600 hover:bg-red-700',
          defaultTitle: 'সতর্কতা!',
        };
      default:
        return {
          icon: <Info className="w-5 h-5 text-black" />,
          borderColor: 'border-black',
          bgToast: 'bg-gray-50 border border-gray-200 text-primary',
          btnBg: 'bg-black hover:bg-gray-800',
          defaultTitle: 'তথ্য',
        };
    }
  };

  const style = getAlertStyles();

  // ১. যদি টোস্ট নোটিফিকেশন হয় (যেমন: অর্ডার প্লেস বা অ্যাডমিন আপডেট সাকসেস)
  if (isToast) {
    return (
      <div className="fixed top-5 right-5 z-50 max-w-sm w-full animate-slideIn shadow-lg rounded-lg overflow-hidden">
        <div className={`p-4 flex items-center justify-between ${style.bgToast}`}>
          <div className="flex items-center gap-3">
            {style.icon}
            <div>
              <p className="text-xs font-bold uppercase tracking-wide">
                {title || style.defaultTitle}
              </p>
              <p className="text-xs mt-0.5 font-light">{message}</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-gray-500 hover:text-black p-1">
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  // ২. নরমাল পপ-আপ মডাল
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className={`bg-white w-full max-w-md rounded-lg shadow-2xl border-t-4 ${style.borderColor} p-6 relative`}>
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-primary font-heading uppercase tracking-wide">
              {title || style.defaultTitle}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleClose}
            className={`px-6 py-2 text-xs font-bold text-white uppercase tracking-wider rounded transition-colors ${style.btnBg}`}
          >
            ঠিক আছে
          </button>
        </div>
      </div>
    </div>
  );
};