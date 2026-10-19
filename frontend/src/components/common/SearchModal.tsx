import React from 'react';
import { useSearch } from '../../features/search/useSearch';
import { Search, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SearchModal: React.FC = () => {
  const { query, isOpen, searchResults, handleQueryChange, closeSearch } = useSearch();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-borderLight">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-borderLight bg-surface">
          <Search size={22} className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="আপনার পছন্দের পাঞ্জাবি বা ক্যাটাগরি সার্চ করুন..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-primary text-base focus:outline-none"
          />
          <button
            onClick={closeSearch}
            className="p-1.5 text-gray-500 hover:text-red-600 rounded-full transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {query.trim() !== '' && searchResults.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p className="text-base font-medium">কোনো পণ্য পাওয়া যায়নি!</p>
              <p className="text-xs text-gray-400 mt-1">অন্য নাম দিয়ে আবার চেষ্টা করুন।</p>
            </div>
          ) : (
            searchResults.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                onClick={closeSearch}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-surface border border-transparent hover:border-borderLight transition-all group"
              >
                {/* Image & Title */}
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-14 h-14 object-cover rounded-lg border border-borderLight"
                  />
                  <div>
                    <h4 className="font-heading font-semibold text-sm text-primary group-hover:text-cardHeader transition-colors">
                      {product.title}
                    </h4>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="text-right flex items-center gap-3">
                  <span className="font-bold text-cardHeader text-base">
                    ৳ {product.price}
                  </span>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-cardHeader transition-colors" />
                </div>
              </Link>
            ))
          )}

          {query.trim() === '' && (
            <div className="text-center py-10 text-gray-400 text-sm">
              সার্চ বারে টাইপ করা শুরু করুন...
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-surface px-4 py-2 border-t border-borderLight text-xs text-gray-500 text-center">
          পাঞ্জাবি অর্ডার ম্যানেজমেন্ট সিস্টেম
        </div>
      </div>
    </div>
  );
};