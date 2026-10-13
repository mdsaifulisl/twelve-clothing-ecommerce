import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ContactPage: React.FC = () => {
  return (
    <div className="bg-white text-primary">
      {/* Header Banner */}
      <div className="bg-gray-50 py-12 sm:py-16 border-b border-borderLight text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-cardHeader mb-2 inline-block">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading uppercase tracking-wide">
            Contact Us
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-gray-500 max-w-xl mx-auto font-light">
            Have questions about your order or our collections? We are here to help you via phone, email, or WhatsApp.
          </p>
        </div>
      </div>

      {/* Main Contact Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Phone & Hotline */}
          <div className="bg-white p-8 border border-borderLight rounded-lg shadow-xs space-y-4 hover:border-black transition-all">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-primary">
              <Phone size={22} />
            </div>
            <h3 className="font-heading font-bold text-lg uppercase tracking-wide">
              Customer Support
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed font-light">
              Talk directly with our support team for order inquiries and sizing guidance.
            </p>
            <div className="pt-2 space-y-2">
              <p className="text-sm font-semibold text-primary">
                Hotline:{' '}
                <a href="tel:01847425569" className="text-cardHeader hover:underline">
                  +880 1847-425569
                </a>
              </p>
              <p className="text-sm font-semibold text-primary">
                WhatsApp:{' '}
                <a 
                  href="https://wa.me/8801847425569" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-green-600 hover:underline inline-flex items-center gap-1"
                >
                  Message Us <MessageSquare size={14} />
                </a>
              </p>
            </div>
          </div>

          {/* Card 2: Email & Official Inquiries */}
          <div className="bg-white p-8 border border-borderLight rounded-lg shadow-xs space-y-4 hover:border-black transition-all">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-primary">
              <Mail size={22} />
            </div>
            <h3 className="font-heading font-bold text-lg uppercase tracking-wide">
              Email Support
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed font-light">
              Send us an email for general questions, corporate orders, or feedback.
            </p>
            <div className="pt-2 space-y-2">
              <p className="text-sm font-semibold text-primary">
                Support:{' '}
                <a href="mailto:support@panjabiordersys.com" className="text-cardHeader hover:underline">
                  support@panjabiordersys.com
                </a>
              </p>
              <p className="text-sm font-semibold text-primary">
                Inquiries:{' '}
                <a href="mailto:info@panjabiordersys.com" className="text-cardHeader hover:underline">
                  info@panjabiordersys.com
                </a>
              </p>
            </div>
          </div>

          {/* Card 3: Head Office & Flagship Store */}
          <div className="bg-white p-8 border border-borderLight rounded-lg shadow-xs space-y-4 hover:border-black transition-all md:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-primary">
              <MapPin size={22} />
            </div>
            <h3 className="font-heading font-bold text-lg uppercase tracking-wide">
              Flagship Outlet
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed font-light">
              Visit our main outlet to experience our exclusive collections firsthand.
            </p>
            <div className="pt-2 space-y-2 text-xs sm:text-sm text-primary leading-relaxed">
              <p className="font-semibold">
                House #12, Road #11, Sector #1, Uttara, Dhaka-1230, Bangladesh
              </p>
              <div className="pt-2">
                <Link
                  to="/stores"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-cardHeader hover:underline uppercase tracking-wider"
                >
                  View All Outlets <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Opening Hours & Social Section */}
      <div className="bg-gray-50 border-t border-b border-borderLight py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Opening Hours */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white border border-borderLight rounded-full flex items-center justify-center text-primary flex-shrink-0 mt-1">
                <Clock size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-sm uppercase tracking-wider">
                  Operating Hours
                </h4>
                <p className="text-xs text-gray-600">
                  Saturday - Thursday: 10:00 AM – 10:00 PM
                </p>
                <p className="text-xs text-gray-600">
                  Friday: 02:00 PM – 10:00 PM
                </p>
              </div>
            </div>

            {/* Social Connect Link */}
            <div className="md:text-right space-y-2">
              <h4 className="font-heading font-bold text-sm uppercase tracking-wider">
                Connect With Us
              </h4>
              <p className="text-xs text-gray-500">
                Follow our official social pages for new arrival updates and promotions.
              </p>
              <div className="flex md:justify-end gap-4 text-xs font-bold uppercase tracking-widest text-primary pt-1">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-cardHeader">
                  Facebook
                </a>
                <span>•</span>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-cardHeader">
                  Instagram
                </a>
                <span>•</span>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-cardHeader">
                  YouTube
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};