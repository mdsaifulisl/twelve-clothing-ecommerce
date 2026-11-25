/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../../../components/public/items/ProductCard';
import type { IProduct } from '../../../features/product/ProductType'; 
import { ChevronUp, ChevronDown, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { useProduct } from '../../../features/product/useProduct';

export const ItemsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, fetchAllProducts, isLoading, error } = useProduct();
  const [maxPrice, setMaxPrice] = useState<number>(15000);

  
  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (products && products.length > 0) {
      const highestPrice = Math.max(...(products as IProduct[]).map((p) => p.price || 0));
      setMaxPrice(Math.max(highestPrice, 15000));
    }
  }, [products]);



  // URL Params Reading
  const categoryParam = searchParams.get('category');
  const subCategoryParam = searchParams.get('subCategory');
  
  const urlProductTypes = searchParams.get('productType') ? searchParams.get('productType')!.split(',') : [];
  const urlSizes = searchParams.get('size') ? searchParams.get('size')!.split(',') : [];

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  
  const [openSections, setOpenSections] = useState({
    price: true,
    productType: true,
    size: true,
  });

  const toggleSection = (section: 'price' | 'productType' | 'size') => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const pageTitle = useMemo(() => {
    if (!categoryParam || categoryParam === 'All Item') return 'All Products';
    if (subCategoryParam) return `${categoryParam}s ${subCategoryParam}`;
    return `${categoryParam}'s Collection`;
  }, [categoryParam, subCategoryParam]);

  const availableProductTypes = useMemo(() => {
    const filteredByCategory = (products as IProduct[]).filter((p) => {
      if (!categoryParam || categoryParam === 'All Item') return true;
      return p.category?.toLowerCase() === categoryParam.toLowerCase();
    });
    return Array.from(new Set(filteredByCategory.map((p) => p.productType).filter(Boolean)));
  }, [categoryParam, products]);

  const availableSizes = ['S', 'M', 'L', 'XL', '2XL', '3XL'];

  // Main Filter Logic
  const filteredProducts = useMemo(() => {
    return (products as IProduct[]).filter((product) => {
      if (categoryParam && categoryParam !== 'All Item' && categoryParam.trim() !== '') {
        if (product.category?.toLowerCase() !== categoryParam.toLowerCase()) {
          return false;
        }
      }

      if (subCategoryParam && subCategoryParam.trim() !== '') {
        if (product.subCategory?.toLowerCase() !== subCategoryParam.toLowerCase()) {
          return false;
        }
      }

      if (product.price > maxPrice) return false;

      if (urlProductTypes.length > 0 && !urlProductTypes.includes(product.productType || '')) {
        return false;
      }

      if (urlSizes.length > 0) {
        const hasSize = product.availableSizes?.some((s) => urlSizes.includes(s)) ?? false;
        if (!hasSize) return false;
      }

      return true;
    });
  }, [products, categoryParam, subCategoryParam, maxPrice, urlProductTypes, urlSizes]);

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

  const filterContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2 font-bold text-sm text-primary uppercase">
          <SlidersHorizontal size={16} /> Filters
        </div>
        <button 
          onClick={() => setIsMobileFilterOpen(false)}
          className="lg:hidden p-1 text-gray-500 hover:text-black cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      {/* PRICE FILTER */}
      <div className="pb-4">
        <button
          type="button"
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between text-xs font-bold text-primary uppercase py-2 cursor-pointer"
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
              max={50000} // স্লাইডারের সর্বোচ্চ সীমা বাড়িয়ে দেওয়া হলো যাতে বড় দামের প্রোডাক্টও কাভার করে
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* PRODUCT TYPE FILTER */}
      <div className="pb-4">
        <button
          type="button"
          onClick={() => toggleSection('productType')}
          className="w-full flex items-center justify-between text-xs font-bold text-primary uppercase py-2 cursor-pointer"
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
                    className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                  />
                  <span>{type}</span>
                </label>
              ))
            )}
          </div>
        )}
      </div>

      {/* SIZE FILTER */}
      <div className="pb-4">
        <button
          type="button"
          onClick={() => toggleSection('size')}
          className="w-full flex items-center justify-between text-xs font-bold text-primary uppercase py-2 cursor-pointer"
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
                  className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
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
      <div className="flex items-center justify-between pb-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold font-heading text-primary">
            {pageTitle}
          </h1>
          <span className="text-xs text-gray-500 font-medium">
            {filteredProducts.length} products
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden flex items-center gap-2 px-3.5 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-primary bg-white shadow-sm cursor-pointer"
        >
          <SlidersHorizontal size={14} /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="hidden lg:block lg:col-span-1">
          {filterContent}
        </div>

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
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-2.5 bg-black text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Apply Filters ({filteredProducts.length})
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-black mb-2" />
              <p className="text-xs text-gray-500">প্রোডাক্ট লোড হচ্ছে...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-red-50 rounded-xl text-red-600">
              <p className="text-sm font-semibold">{error}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-xl">
              <p className="text-base font-semibold text-gray-600">No products found!</p>
              <p className="text-xs text-gray-400 mt-1">Please change your filter criteria and try again.</p>
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

export default ItemsPage;