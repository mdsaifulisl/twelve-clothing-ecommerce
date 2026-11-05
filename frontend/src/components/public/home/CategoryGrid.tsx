import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Loader2 } from 'lucide-react';
import { useProduct } from '../../../features/product/useProduct';
import type { IProduct } from '../../../features/product/ProductType';

export const CategoryGrid: React.FC = () => {
  const { products, fetchAllProducts, isLoading } = useProduct();

  // পেজ লোড হওয়ার সাথে সাথে প্রোডাক্ট ফেচ করা
  useEffect(() => {
    fetchAllProducts();
  }, []);

  // 🚀 ক্যাটাগরি এবং সাব-ক্যাটাগরি ভিত্তিক ডাইনামিক গ্রিড আইটেম তৈরি করা (সর্বোচ্চ ১০টি)
  const dynamicCategoryCards = useMemo(() => {
    if (!products || products.length === 0) return [];

    const productList = products as IProduct[];
    const cardMap = new Map<string, { id: string; title: string; image: string; link: string }>();

    productList.forEach((product) => {
      const category = product.category;
      const subCategory = product.subCategory || product.productType;

      if (!category) return;

      const key = subCategory ? `${category}-${subCategory}` : category;

      if (!cardMap.has(key)) {
        const imageUrl = Array.isArray(product.image) && product.image.length > 0 
          ? product.image[0] 
          : 'https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?auto=format&fit=crop&q=80&w=800';

        const title = subCategory ? `${category} ${subCategory}` : category;
        const link = subCategory 
          ? `/items?category=${encodeURIComponent(category)}&subCategory=${encodeURIComponent(subCategory)}`
          : `/items?category=${encodeURIComponent(category)}`;

        cardMap.set(key, {
          id: key.toLowerCase().replace(/\s+/g, '-'),
          title: title,
          image: imageUrl,
          link: link,
        });
      }
    });

    // সর্বোচ্চ ১০টি কার্ড রিটার্ন করা
    return Array.from(cardMap.values()).slice(0, 10);
  }, [products]);

  // টপ ২টি বড় কার্ড এবং বাকিগুলোকে সাব-ক্যাটাগরি কার্ড হিসেবে ভাগ করা
  const topCategories = dynamicCategoryCards.slice(0, 2);
  const subCategories = dynamicCategoryCards.slice(2, 10); // বাকিগুলো (সর্বোচ্চ ৮টি)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-black mb-2" />
        <p className="text-xs text-gray-500">Loading categories...</p>
      </div>
    );
  }

  if (dynamicCategoryCards.length === 0) {
    return null; 
  }

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 md:py-12 space-y-6 sm:space-y-8">
      
      {/* Top 2 Large Grid Cards (Featured Cards) */}
      {topCategories.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6">
          {topCategories.map((item) => (
            <Link 
              key={item.id} 
              to={item.link}
              className="group relative overflow-hidden bg-gray-100 rounded-lg border border-borderLight shadow-sm block hover:shadow-md transition-all"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>
              <div className="p-3 sm:p-4 flex items-center justify-between bg-white">
                <span className="inline-flex items-center gap-1 font-heading font-bold text-sm sm:text-base md:text-lg text-primary group-hover:text-cardHeader transition-colors">
                  <span>{item.title}</span>
                  <ChevronRight size={18} className="text-gray-500 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[10px] sm:text-xs text-gray-400 font-medium">Featured</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Bottom Sub-Categories (Mobile-এ ২ কলাম এবং Desktop-এ ৩ কলাম) */}
      {subCategories.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {subCategories.map((item) => (
            <Link 
              key={item.id} 
              to={item.link}
              className="group relative overflow-hidden bg-gray-100 rounded-lg border border-borderLight shadow-sm block hover:shadow-md transition-all"
            >
              <div className="aspect-[4/5] w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>
              <div className="p-2.5 sm:p-4 flex items-center justify-between bg-white">
                <span className="inline-flex items-center gap-1 font-heading font-semibold text-xs sm:text-sm md:text-base text-primary group-hover:text-cardHeader transition-colors truncate">
                  <span className="truncate">{item.title}</span>
                  <ChevronRight size={16} className="text-gray-500 group-hover:translate-x-1 transition-transform shrink-0" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

    </section>
  );
};

export default CategoryGrid;