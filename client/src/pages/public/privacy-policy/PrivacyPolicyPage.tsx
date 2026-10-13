import React from 'react';
import { ShieldCheck, Lock, Eye, Database, RefreshCw, Mail } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-white text-primary">
      {/* Header Banner */}
      <div className="bg-gray-50 py-12 sm:py-16 border-b border-borderLight text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-cardHeader mb-2 inline-block">
            Your Trust Matters
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading uppercase tracking-wide">
            Privacy Policy
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-gray-500 max-w-xl mx-auto font-light">
            Last updated: October 2026. Learn how we collect, use, and protect your personal information when you shop with us.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10 text-sm leading-relaxed text-gray-600 font-light">
        
        {/* Intro */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <ShieldCheck size={24} className="text-cardHeader" />
            <h2 className="text-lg font-bold font-heading uppercase tracking-wide">
              1. Introduction
            </h2>
          </div>
          <p>
            Welcome to Panjabi Order Management System. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
          </p>
        </div>

        {/* Information We Collect */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Database size={24} className="text-cardHeader" />
            <h2 className="text-lg font-bold font-heading uppercase tracking-wide">
              2. Information We Collect
            </h2>
          </div>
          <p>
            When you place an order, create an account, or interact with our store, we may collect the following types of information:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-primary font-medium">Personal Identification Details:</strong> Name, email address, phone number, and delivery address.</li>
            <li><strong className="text-primary font-medium">Order & Transaction Data:</strong> Details about products you purchase, sizes, cart history, and payment status.</li>
            <li><strong className="text-primary font-medium">Technical Data:</strong> IP address, browser type, device information, and browsing behaviour through cookies.</li>
          </ul>
        </div>

        {/* How We Use Your Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Eye size={24} className="text-cardHeader" />
            <h2 className="text-lg font-bold font-heading uppercase tracking-wide">
              3. How We Use Your Information
            </h2>
          </div>
          <p>
            We use the information we collect in various ways, including to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Process, fulfil, and manage your orders and deliveries.</li>
            <li>Send you order confirmations, tracking updates, and support notifications.</li>
            <li>Improve our website performance, product catalog, and user experience.</li>
            <li>Communicate promotional offers, discounts, and new festive collections (with your consent).</li>
          </ul>
        </div>

        {/* Data Security */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Lock size={24} className="text-cardHeader" />
            <h2 className="text-lg font-bold font-heading uppercase tracking-wide">
              4. Data Security
            </h2>
          </div>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorised way. Access to your personal data is restricted to employees and authorized third parties who have a business need to know.
          </p>
        </div>

        {/* Cookies */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <RefreshCw size={24} className="text-cardHeader" />
            <h2 className="text-lg font-bold font-heading uppercase tracking-wide">
              5. Cookies and Local Storage
            </h2>
          </div>
          <p>
            Our website uses local storage and cookies to maintain your shopping cart items, remember your preferences, and analyze site traffic to provide a seamless e-commerce experience. You can choose to disable cookies through your browser settings, though this may affect site functionality.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 p-8 rounded-lg border border-borderLight space-y-3">
          <div className="flex items-center gap-3 text-primary">
            <Mail size={22} className="text-cardHeader" />
            <h3 className="font-heading font-bold text-base uppercase tracking-wide">
              Questions or Concerns?
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 font-light">
            If you have any questions about this Privacy Policy or wish to exercise your data rights, please contact our support team at:
          </p>
          <p className="text-xs sm:text-sm font-semibold text-primary">
            Email: <a href="mailto:privacy@panjabiordersys.com" className="text-cardHeader hover:underline">privacy@panjabiordersys.com</a> | Hotline: <a href="tel:01847425569" className="text-cardHeader hover:underline">+880 1847-425569</a>
          </p>
        </div>

      </div>
    </div>
  );
};