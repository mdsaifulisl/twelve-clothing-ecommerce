import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, LogIn } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-surface px-4 py-12">
      <div className="text-center max-w-lg bg-white p-8 rounded-2xl shadow-sm border border-borderLight">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert size={36} />
        </div>

        <h1 className="text-3xl font-extrabold font-heading text-primary mb-2">
          অনুমতি নেই (403)
        </h1>
        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
          আপনার এই পেজটি ভিজিট করার অনুমতি নেই। অনুগ্রহ করে সঠিক অ্যাকাউন্ট দিয়ে লগইন করুন অথবা অ্যাডমিনের সাথে যোগাযোগ করুন।
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link 
            to="/login" 
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cardHeader text-white text-sm font-semibold hover:bg-opacity-90 transition-colors shadow-sm"
          >
            <LogIn size={16} /> লগইন করুন
          </Link>

          <Link 
            to="/" 
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-borderLight bg-white text-primary text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Home size={16} /> হোমপেজ
          </Link>
        </div>
      </div>
    </div>
  );
};