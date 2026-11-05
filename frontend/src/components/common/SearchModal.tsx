import React, { useEffect, useMemo } from 'react';
import { useSearch } from '../../features/search/useSearch';
import { useProduct } from '../../features/product/useProduct';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { IProduct } from '../../features/product/ProductType';

export const SearchModal: React.FC = () => {
  const { query, isOpen, handleQueryChange, closeSearch } = useSearch();
  const { products, fetchAllProducts, isLoading } = useProduct();

  // মডাল ওপেন হলে ব্যাকএন্ড বা স্টেট থেকে প্রোডাক্ট ফেচ করা
  useEffect(() => {
    if (isOpen) {
      fetchAllProducts();
    }
  }, [isOpen]);

  // 🚀 useProduct থেকে আসা রিয়েল প্রোডাক্ট ডেটা দিয়ে সার্চ ফিল্টারিং
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return (products as IProduct[]).filter((product) => 
      product.title?.toLowerCase().includes(searchTerm) ||
      product.category?.toLowerCase().includes(searchTerm) ||
      product.subCategory?.toLowerCase().includes(searchTerm) ||
      product.productType?.toLowerCase().includes(searchTerm)
    );
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-fadeIn font-sans">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-borderLight">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-borderLight bg-surface">
          <Search size={22} className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search for your favorite panjabi or category..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-primary text-base focus:outline-none"
          />
          <button
            type="button"
            onClick={closeSearch}
            className="p-1.5 text-gray-500 hover:text-red-600 rounded-full transition-colors cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-black mb-2" />
              <p className="text-xs text-gray-500">Loading products...</p>
            </div>
          ) : query.trim() !== '' && searchResults.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p className="text-base font-medium">No products found!</p>
              <p className="text-xs text-gray-400 mt-1">Try searching with a different keyword.</p>
            </div>
          ) : (
            searchResults.map((product) => {
              // প্রোডাক্টের ইমেজ অ্যারে থেকে সেফলি প্রথম ইমেজটি নেওয়া
              const imageUrl = Array.isArray(product.image) && product.image.length > 0 
                ? product.image[0] 
                : '/placeholder.png';

              return (
                <Link
                  key={product.id}
                  to={`/items/${product.id}`}
                  onClick={closeSearch}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-surface border border-transparent hover:border-borderLight transition-all group"
                >
                  {/* Image & Title */}
                  <div className="flex items-center gap-4">
                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="w-14 h-14 object-cover rounded-lg border border-borderLight bg-gray-50"
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
                      ৳ {product.price?.toLocaleString()}
                    </span>
                    <ArrowRight size={16} className="text-gray-400 group-hover:text-cardHeader transition-colors" />
                  </div>
                </Link>
              );
            })
          )}

          {query.trim() === '' && !isLoading && (
            <div className="text-center py-10 text-gray-400 text-sm">
              Start typing in the search bar...
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-surface px-4 py-2 border-t border-borderLight text-xs text-gray-500 text-center">
          Panjabi Order Management System
        </div>
      </div>
    </div>
  );
};

export default SearchModal;