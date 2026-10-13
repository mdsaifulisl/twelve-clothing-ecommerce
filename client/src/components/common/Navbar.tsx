/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, ChevronDown, Menu, X } from 'lucide-react';

import productsData from '../../data/products.json';
import { useSearch } from '../../features/search/useSearch';
import { useCart } from '../../features/cart/useCart';

interface ProductItem {
  id: string;
  category: string;
  subCategory: string;
  productType?: string;
  discount?: number;
  image?: string[];
  [key: string]: any;
}

interface NavColumn {
  title: string;
  items: string[];
}

interface NavCategory {
  name: string;
  path: string;
  hasDropdown: boolean;
  columns?: NavColumn[];
  bannerImage?: string;
}

export const Navbar: React.FC = () => {
  const { openSearch } = useSearch();
  const { openCart, totalQuantity } = useCart();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);

  // products.json theke dynamic categories & banner generate kora
  const navCategories = useMemo<NavCategory[]>(() => {
    const products = productsData as ProductItem[];

    const getSubCategories = (catName: string) => {
      const filtered = products.filter(
        (p) => p.category.toLowerCase() === catName.toLowerCase()
      );
      return Array.from(new Set(filtered.map((p) => p.subCategory))).filter(Boolean);
    };

    const getBannerImage = (catName: string) => {
      const found = products.find(
        (p) => p.category.toLowerCase() === catName.toLowerCase() && p.image && p.image.length > 0
      );
      return found ? found.image![0] : undefined;
    };

    const menSubCats = getSubCategories('Men');
    const womenSubCats = getSubCategories('Women');
    const kidsSubCats = getSubCategories('Kids');

    return [
      {
        name: 'Men',
        path: '/items?category=Men',
        hasDropdown: true,
        columns: [
          {
            title: 'Tops',
            items: menSubCats.filter((s) => !['Pajama', 'Pant', 'Shorts'].some((b) => s.includes(b))).length > 0
              ? menSubCats.filter((s) => !['Pajama', 'Pant', 'Shorts'].some((b) => s.includes(b)))
              : ['Panjabi', 'Casual Shirt'],
          },
          {
            title: 'Bottoms',
            items: ['Pajama', 'Denim Pant', 'Twill Pant', 'Shorts'],
          },
        ],
        bannerImage: getBannerImage('Men') || 'https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: 'Women',
        path: '/items?category=Women',
        hasDropdown: true,
        columns: [
          {
            title: 'Tops',
            items: womenSubCats.length > 0 ? womenSubCats : ['Three Piece', 'Sharee', 'Gown', 'Kurti'],
          },
          {
            title: 'Bottoms',
            items: ['Palazzo', 'Leggings', 'Trousers', 'Skirt'],
          },
        ],
        bannerImage: getBannerImage('Women') || 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: 'Kids',
        path: '/items?category=Kids',
        hasDropdown: true,
        columns: [
          {
            title: "Boy's Collection",
            items: kidsSubCats.filter((s) => s.toLowerCase().includes('boy'))['length'] > 0
              ? kidsSubCats.filter((s) => s.toLowerCase().includes('boy'))
              : ['Boys Panjabi', 'Boys Kabli', 'Boys T-Shirt', 'Boys Pant'],
          },
          {
            title: "Girl's Collection",
            items: kidsSubCats.filter((s) => s.toLowerCase().includes('girl'))['length'] > 0
              ? kidsSubCats.filter((s) => s.toLowerCase().includes('girl'))
              : ['Girls Frock', 'Girls Kurti', 'Girls Three Piece'],
          },
        ],
        bannerImage: getBannerImage('Kids') || 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: 'All Item',
        path: '/items?category=All%20Item',
        hasDropdown: false,
      },
      {
        name: 'Accessories',
        path: '/items?category=Accessories',
        hasDropdown: false,
      },
      {
        name: '20% OFF',
        path: '/items?discount=20',
        hasDropdown: false,
      },
    ];
  }, []);

  const toggleMobileCategory = (name: string) => {
    setExpandedMobileCategory((prev) => (prev === name ? null : name));
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-borderLight shadow-sm">
      {/* Top Banner */}
      <div className="bg-cardAccent text-white text-xs text-center py-1 font-medium px-2">
        বড়দিন ও ঈদ কালেকশনে চলছে আকর্ষণীয় ডিসকাউন্ট!
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo (Left side) */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/logos.png" 
                alt="Panjabi Order System" 
                className="h-10 md:h-12 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.nextElementSibling) {
                    (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                  }
                }}
              />
              <div className="hidden items-center gap-2">
                <div className="bg-cardHeader text-white font-bold px-2 py-1 rounded text-lg md:text-xl tracking-wider">
                  PANJABI
                </div>
                <span className="font-heading font-bold text-lg md:text-xl tracking-widest text-primary hidden sm:inline">
                  ORDER SYS
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            {navCategories.map((category) => (
              <div 
                key={category.name}
                className="relative py-4"
                onMouseEnter={() => category.hasDropdown && setActiveDropdown(category.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link 
                  to={category.path} 
                  className={`flex items-center gap-1 text-sm font-semibold transition-colors ${
                    category.name === "20% OFF" ? "text-red-600 font-bold hover:text-red-700" : "text-primary hover:text-cardHeader"
                  }`}
                >
                  {category.name}
                  {category.hasDropdown && <ChevronDown size={16} />}
                </Link>

                {/* Desktop Mega Menu Dropdown */}
                {category.hasDropdown && activeDropdown === category.name && category.columns && (
                  <div className="absolute top-full left-[-100px] w-[750px] bg-white border border-borderLight shadow-xl rounded-b-xl p-8 grid grid-cols-3 gap-6 animate-fadeIn">
                    {category.columns.map((col, idx) => (
                      <div key={idx}>
                        <h3 className="font-heading font-bold text-sm text-primary uppercase border-b pb-2 mb-3">
                          {col.title}
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                          {col.items.map((item, itemIdx) => (
                            <li key={itemIdx}>
                              <Link 
                                to={`/items?category=${category.name}&subCategory=${encodeURIComponent(item)}`} 
                                className="hover:text-cardHeader transition-colors"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {/* Image Banner */}
                    {category.bannerImage && (
                      <div className="bg-surface rounded-lg overflow-hidden flex items-center justify-center p-1 border border-borderLight">
                        <img 
                          src={category.bannerImage} 
                          alt={category.name} 
                          className="object-cover h-full w-full rounded"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Action Icons & Mobile Menu Button */}
          <div className="flex items-center space-x-3 sm:space-x-5 text-primary">
            <button onClick={openSearch} className="hover:text-cardHeader transition-colors p-1" aria-label="Search">
              <Search size={20} className="sm:w-5 sm:h-5" />
            </button>
            <Link to="/login" className="hover:text-cardHeader transition-colors p-1" aria-label="User Account">
              <User size={20} className="sm:w-5 sm:h-5" />
            </Link>
            <button className="hover:text-cardHeader transition-colors relative p-1" aria-label="Wishlist">
              <Heart size={20} className="sm:w-5 sm:h-5" />
              <span className="absolute -top-1 -right-1 bg-cardHeader text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            </button>
            <button onClick={openCart} className="hover:text-cardHeader transition-colors relative p-1" aria-label="Cart">
              <ShoppingBag size={20} className="sm:w-5 sm:h-5" />
              <span className="absolute -top-1 -right-1 bg-cardHeader text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {totalQuantity}
              </span>
            </button>

            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="md:hidden text-primary hover:text-cardHeader focus:outline-none p-1 ml-1"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-borderLight shadow-lg max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="px-4 py-3 space-y-2">
            {navCategories.map((category) => (
              <div key={category.name} className="border-b border-gray-100 last:border-none pb-2">
                <div className="flex items-center justify-between py-2">
                  <Link 
                    to={category.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-base font-medium ${
                      category.name === "20% OFF" ? "text-red-600 font-bold" : "text-primary"
                    }`}
                  >
                    {category.name}
                  </Link>
                  {category.hasDropdown && (
                    <button 
                      onClick={() => toggleMobileCategory(category.name)} 
                      className="p-2 text-gray-500 hover:text-cardHeader"
                    >
                      <ChevronDown 
                        size={18} 
                        className={`transition-transform duration-200 ${
                          expandedMobileCategory === category.name ? "rotate-180" : ""
                        }`} 
                      />
                    </button>
                  )}
                </div>

                {/* Mobile Accordion Submenu */}
                {category.hasDropdown && expandedMobileCategory === category.name && category.columns && (
                  <div className="pl-4 py-2 space-y-4 bg-gray-50 rounded-lg my-1">
                    {category.columns.map((col, idx) => (
                      <div key={idx}>
                        <h4 className="font-heading font-semibold text-xs text-gray-500 uppercase mb-2">
                          {col.title}
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                          {col.items.map((item, itemIdx) => (
                            <Link 
                              key={itemIdx} 
                              to={`/items?category=${category.name}&subCategory=${encodeURIComponent(item)}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="hover:text-cardHeader py-1"
                            >
                              {item}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};