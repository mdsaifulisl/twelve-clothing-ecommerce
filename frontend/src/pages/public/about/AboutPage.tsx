import React from 'react';
import { Link } from 'react-router-dom';
import { Award, HeartHandshake, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-white text-primary">
      {/* Hero Section */}
      <div className="relative bg-gray-50 py-16 sm:py-24 border-b border-borderLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-cardHeader mb-3 inline-block">
            Welcome To Our World
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-wider uppercase mb-6">
            About Our Brand
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-600 leading-relaxed font-light">
            We blend traditional heritage with modern fashion aesthetics. Every Panjabi and ethnic piece we create tells a story of craftsmanship, elegance, and uncompromised quality.
          </p>
        </div>
      </div>

      {/* Story & Vision Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold font-heading uppercase text-primary">
              Crafting Elegance For Every Celebration
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Founded with a passion for traditional attire, our platform has grown into a trusted destination for premium Panjabis, festive wear, and exclusive ethnic collections. We take pride in sourcing the finest fabrics—from rich silk blends to breathable pure cottons—ensuring absolute comfort without compromising on style.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Whether it's Eid, weddings, or casual festive gatherings, our designs focus on intricate embroidery, refined cuts, and meticulous attention to detail.
            </p>
            <div className="pt-4">
              <Link
                to="/items?category=Men"
                className="inline-block bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-opacity-95 transition-all"
              >
                Explore Collection
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-xl bg-gray-100">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800"
              alt="Our Workshop and Store"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="bg-gray-50 py-16 sm:py-20 border-t border-b border-borderLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold font-heading uppercase">
              Why Choose Us
            </h2>
            <p className="text-xs text-gray-500 mt-2">
              Values that drive our commitment to excellence and customer satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-white p-8 border border-borderLight shadow-sm text-center space-y-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-primary">
                <Sparkles size={22} />
              </div>
              <h3 className="font-heading font-bold text-base uppercase">Premium Quality</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                We use hand-picked fabrics and premium threads to ensure durability, softness, and a luxurious feel.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white p-8 border border-borderLight shadow-sm text-center space-y-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-primary">
                <Award size={22} />
              </div>
              <h3 className="font-heading font-bold text-base uppercase">Authentic Craftsmanship</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                From intricate Karchupi work to fine embroidery, our artisans bring traditional artistry to life.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white p-8 border border-borderLight shadow-sm text-center space-y-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-primary">
                <HeartHandshake size={22} />
              </div>
              <h3 className="font-heading font-bold text-base uppercase">Customer First</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Seamless shopping experience, reliable size guides, and dedicated support for all your festive needs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl sm:text-4xl font-extrabold font-heading uppercase mb-4">
          Ready To Experience Pure Elegance?
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto mb-8">
          Browse through our exclusive categories and find the perfect outfit for your upcoming celebration.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/items?category=Men"
            className="bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all"
          >
            Men's Collection
          </Link>
          <Link
            to="/items?category=Women"
            className="border-2 border-black text-primary px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all"
          >
            Women's Collection
          </Link>
        </div>
      </div>
    </div>
  );
};

