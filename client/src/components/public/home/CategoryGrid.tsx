import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface CategoryGridItem {
  id: string;
  title: string;
  image: string;
  link: string;
}

// ২টা বড় কার্ড (Featured Grid)
const topCategories: CategoryGridItem[] = [
  {
    id: 'men-polos',
    title: 'Men Polos',
    image: 'https://images.unsplash.com/photo-1625910513413-5acc23e4210e?auto=format&fit=crop&q=80&w=800',
    link: '/category/polo',
  },
  {
    id: 'men-denim-pants',
    title: 'Men Denim Pants',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800',
    link: '/category/denim-pant',
  },
];

// ৬টি ছোট কার্ড (Bottom Grid - 3 Column Layout)
const subCategories: CategoryGridItem[] = [
  {
    id: 'men-casual-shirts',
    title: 'Men Casual Shirts',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600',
    link: '/category/casual-shirt',
  },
  {
    id: 'women-kurti',
    title: 'Women Kurti',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600',
    link: '/category/kurti',
  },
  {
    id: 'all-boys-collection',
    title: 'All Boys Collection',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&q=80&w=600',
    link: '/category/boys-panjabi',
  },
  {
    id: 'women-tops',
    title: 'Women Tops',
    image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&q=80&w=600',
    link: '/category/tops',
  },
  {
    id: 'men-tshirts',
    title: 'Men T-Shirts',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600',
    link: '/category/t-shirt',
  },
  {
    id: 'all-girls-collection',
    title: 'All Girls Collection',
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=600',
    link: '/category/girls-frock',
  },
];

export const CategoryGrid: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      
      {/* Top 2 Large Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topCategories.map((item) => (
          <div key={item.id} className="group relative overflow-hidden bg-gray-100 rounded-lg">
            <div className="aspect-[4/3] w-full overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>
            <div className="py-3 flex items-center justify-start bg-white">
              <Link
                to={item.link}
                className="inline-flex items-center gap-1 font-heading font-bold text-base md:text-lg text-primary hover:text-cardHeader transition-colors"
              >
                <span>{item.title}</span>
                <ChevronRight size={18} className="text-gray-500 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom 6 Sub-Categories (3 Column Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subCategories.map((item) => (
          <div key={item.id} className="group relative overflow-hidden bg-gray-100 rounded-lg">
            <div className="aspect-[4/5] w-full overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>
            <div className="py-3 flex items-center justify-start bg-white">
              <Link
                to={item.link}
                className="inline-flex items-center gap-1 font-heading font-semibold text-sm md:text-base text-primary hover:text-cardHeader transition-colors"
              >
                <span>{item.title}</span>
                <ChevronRight size={16} className="text-gray-500 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};