import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface CategoryItem {
  id: string;
  title: string;
  image: string;
  link: string;
}

const categories: CategoryItem[] = [
  {
    id: 'women',
    title: 'Women',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600',
    link: '/women',
  },
  {
    id: 'men',
    title: 'Men',
    image: 'https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?auto=format&fit=crop&q=80&w=600',
    link: '/men',
  },
  {
    id: 'kids',
    title: 'Kids',
    image: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&q=80&w=600',
    link: '/kids',
  },
];

export const FeaturedCategories: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="group relative overflow-hidden rounded-lg">
            {/* Category Image Container */}
            <div className="aspect-[4/5] w-full overflow-hidden bg-gray-100">
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>

            {/* Category Title & Link */}
            <div className="mt-3 flex items-center justify-start">
              <Link
                to={category.link}
                className="inline-flex items-center gap-1 font-heading font-bold text-base md:text-lg text-primary hover:text-cardHeader transition-colors"
              >
                <span>{category.title}</span>
                <ChevronRight size={18} className="text-gray-500 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};