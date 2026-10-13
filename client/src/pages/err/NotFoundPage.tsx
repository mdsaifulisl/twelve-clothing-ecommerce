import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-surface px-4 py-12">
      <div className="text-center max-w-lg">
        <h1 className="text-9xl font-extrabold text-cardHeader tracking-widest">
          404
        </h1>
        <div className="bg-cardAccent text-white px-3 py-1 text-xs uppercase font-semibold rounded inline-block -rotate-12 transform -translate-y-6">
          Page Not Found
        </div>
        
        <h2 className="text-2xl font-bold font-heading text-primary mt-4 mb-2">
          দুঃখিত, পেজটি পাওয়া যায়নি!
        </h2>
        <p className="text-gray-600 mb-8 text-sm leading-relaxed">
          আপনি যে পেজটি খুঁজছেন তা হয়তো মুছে ফেলা হয়েছে, নাম পরিবর্তন করা হয়েছে অথবা সাময়িকভাবে অনুপলব্ধ রয়েছে।
        </p>

        <div className="flex items-center justify-center gap-4">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-borderLight bg-white text-primary text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ArrowLeft size={16} /> পিছনে যান
          </button>
          
          <Link 
            to="/" 
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cardHeader text-white text-sm font-semibold hover:bg-opacity-90 transition-colors shadow-sm"
          >
            <Home size={16} /> হোমপেজে যান
          </Link>
        </div>
      </div>
    </div>
  );
};