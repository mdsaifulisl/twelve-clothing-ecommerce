import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import productsData from '../../../data/products.json';
import { ProductCard, type Product } from '../../../components/public/items/ProductCard';
import { ChevronUp, ChevronDown, SlidersHorizontal, X } from 'lucide-react';





export const ItemsPage: React.FC = () => {

  const [searchParams, setSearchParams] = useSearchParams();

  // URL Params Reading
  const categoryParam = searchParams.get('category');
  const subCategoryParam = searchParams.get('subCategory');
  
  // URL থেকে বর্তমান সিলেক্টেড productType এবং size কুয়েরি রিড করা
  const urlProductTypes = searchParams.get('productType') ? searchParams.get('productType')!.split(',') : [];
  const urlSizes = searchParams.get('size') ? searchParams.get('size')!.split(',') : [];

  // Accordion & Filter States
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  
  const [openSections, setOpenSections] = useState({
    price: true,
    productType: true,
    size: true,
  });

  const toggleSection = (section: 'price' | 'productType' | 'size') => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    // ক্যাটাগরি বদলালে অতিরিক্ত লজিক থাকলে এখানে হ্যান্ডেল করা যাবে
  }, [categoryParam]);

  // 1. Dynamic Page Heading Title
  const pageTitle = useMemo(() => {
    if (!categoryParam || categoryParam === 'All Item') return 'All Products';
    if (subCategoryParam) return `${categoryParam}s ${subCategoryParam}`;
    return `${categoryParam}'s Collection`;
  }, [categoryParam, subCategoryParam]);

  // 2. বর্তমান ক্যাটাগরির ওপর ভিত্তি করে সংশ্লিষ্ট Product Type গুলোর তালিকা তৈরি
  const availableProductTypes = useMemo(() => {
    const filteredByCategory = (productsData as Product[]).filter((p) => {
      if (!categoryParam || categoryParam === 'All Item') return true;
      return p.category.toLowerCase() === categoryParam.toLowerCase();
    });
    return Array.from(new Set(filteredByCategory.map((p) => p.productType)));
  }, [categoryParam]);

  const availableSizes = ['S', 'M', 'L', 'XL', '2XL', '3XL'];

  // 3. Main Filter Logic
  const filteredProducts = useMemo(() => {
    return (productsData as Product[]).filter((product) => {
      if (categoryParam && categoryParam !== 'All Item') { 
        if (product.category.toLowerCase() !== categoryParam.toLowerCase()) {
          return false;
        }
      }

      if (subCategoryParam) {
        if (product.subCategory.toLowerCase() !== subCategoryParam.toLowerCase()) {
          return false;
        }
      }

      if (product.price > maxPrice) return false;

      if (urlProductTypes.length > 0 && !urlProductTypes.includes(product.productType)) {
        return false;
      }

      if (urlSizes.length > 0) {
        const hasSize = product.availableSizes?.some((s) => urlSizes.includes(s)) ?? false;
        if (!hasSize) return false;
      }

      return true;
    });
  }, [categoryParam, subCategoryParam, maxPrice, urlProductTypes, urlSizes]);

  const handleTypeCheckbox = (type: string) => {
    const newTypes = urlProductTypes.includes(type)
      ? urlProductTypes.filter((t) => t !== type)
      : [...urlProductTypes, type];

    const newParams = new URLSearchParams(searchParams);
    if (newTypes.length > 0) {
      newParams.set('productType', newTypes.join(','));
    } else {
      newParams.delete('productType');
    }
    setSearchParams(newParams);
  };

  const handleSizeCheckbox = (size: string) => {
    const newSizes = urlSizes.includes(size)
      ? urlSizes.filter((s) => s !== size)
      : [...urlSizes, size];

    const newParams = new URLSearchParams(searchParams);
    if (newSizes.length > 0) {
      newParams.set('size', newSizes.join(','));
    } else {
      newParams.delete('size');
    }
    setSearchParams(newParams);
  };

  // Filter Content Component
  const filterContent = (
    <div className="space-y-6">
      {/* Filters Header (বর্ডার রিমুভ করা হয়েছে) */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2 font-bold text-sm text-primary uppercase">
          <SlidersHorizontal size={16} /> Filters
        </div>
        <button 
          onClick={() => setIsMobileFilterOpen(false)}
          className="lg:hidden p-1 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>
      </div>

      {/* PRICE FILTER (বর্ডার রিমুভ করা হয়েছে) */}
      <div className="pb-4">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between text-xs font-bold text-primary uppercase py-2"
        >
          PRICE {openSections.price ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {openSections.price && (
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Tk 1,000.00</span>
              <span>Tk {maxPrice.toLocaleString()}.00</span>
            </div>
            <input
              type="range"
              min={1000}
              max={15000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* PRODUCT TYPE FILTER (বর্ডার রিমুভ করা হয়েছে) */}
      <div className="pb-4">
        <button
          onClick={() => toggleSection('productType')}
          className="w-full flex items-center justify-between text-xs font-bold text-primary uppercase py-2"
        >
          PRODUCT TYPE {openSections.productType ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {openSections.productType && (
          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
            {availableProductTypes.length === 0 ? (
              <p className="text-xs text-gray-400">কোনো প্রোডাক্ট টাইপ নেই</p>
            ) : (
              availableProductTypes.map((type) => (
                <label key={type} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:text-black">
                  <input
                    type="checkbox"
                    checked={urlProductTypes.includes(type)}
                    onChange={() => handleTypeCheckbox(type)}
                    className="rounded border-gray-300 text-black focus:ring-black"
                  />
                  <span>{type}</span>
                </label>
              ))
            )}
          </div>
        )}
      </div>

      {/* SIZE FILTER (বর্ডার রিমুভ করা হয়েছে) */}
      <div className="pb-4">
        <button
          onClick={() => toggleSection('size')}
          className="w-full flex items-center justify-between text-xs font-bold text-primary uppercase py-2"
        >
          SIZE {openSections.size ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {openSections.size && (
          <div className="mt-3 space-y-2">
            {availableSizes.map((size) => (
              <label key={size} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:text-black">
                <input
                  type="checkbox"
                  checked={urlSizes.includes(size)}
                  onChange={() => handleSizeCheckbox(size)}
                  className="rounded border-gray-300 text-black focus:ring-black"
                />
                <span>{size}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
      {/* Page Title, Product Count & Mobile Filter Toggle Button (বর্ডার রিমুভ করা হয়েছে) */}
      <div className="flex items-center justify-between pb-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold font-heading text-primary">
            {pageTitle}
          </h1>
          <span className="text-xs text-gray-500 font-medium">
            {filteredProducts.length} products
          </span>
        </div>

        {/* Mobile Filter Trigger Button */}
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden flex items-center gap-2 px-3.5 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-primary bg-white shadow-sm"
        >
          <SlidersHorizontal size={14} /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1">
          {filterContent}
        </div>

        {/* Mobile Left Fixed Drawer Overlay */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div 
              className="fixed inset-0 bg-black/50 transition-opacity" 
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <div className="relative w-80 max-w-[80%] bg-white h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between">
              {filterContent}
              <div className="pt-4 border-t mt-4">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-2.5 bg-black text-white text-xs font-semibold rounded-lg"
                >
                  Apply Filters ({filteredProducts.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right Product Grid Display */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-xl">
              <p className="text-base font-semibold text-gray-600">কোনো পণ্য পাওয়া যায়নি!</p>
              <p className="text-xs text-gray-400 mt-1">ফিল্টারের শর্ত পরিবর্তন করে আবার চেষ্টা করুন।</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};