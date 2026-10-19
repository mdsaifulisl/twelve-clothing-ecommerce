import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  link: string;
}

const slides: BannerSlide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=1600',
    title: "Men's WESTERN Styles",
    subtitle: 'Discover the latest trend in Men Casuals',
    buttonText: 'SHOP NOW',
    link: '/men',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1600',
    title: 'NEW EID COLLECTION',
    subtitle: 'Exclusive Festive Wear for Everyone',
    buttonText: 'EXPLORE ALL',
    link: '/all-item',
  },
];

export const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative w-full overflow-hidden bg-surface">
      {/* Slider Container */}
      <div 
        className="flex transition-transform duration-700 ease-out h-[400px] sm:h-[500px] md:h-[600px]"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full flex-shrink-0 relative h-full">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Banner Content Container */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-heading text-white tracking-wide drop-shadow-md mb-2">
                {slide.title}
              </h2>
              <p className="text-sm sm:text-lg text-white/90 font-medium mb-6 drop-shadow">
                {slide.subtitle}
              </p>
              <Link
                to={slide.link}
                className="bg-[#F26522] hover:bg-[#d95213] text-white font-bold px-8 py-3 rounded-md text-sm md:text-base tracking-widest transition-all transform hover:scale-105 shadow-lg"
              >
                {slide.buttonText}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-primary p-2 rounded-full transition-colors shadow-md"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-primary p-2 rounded-full transition-colors shadow-md"
        aria-label="Next Slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === index ? 'bg-[#F26522] w-6' : 'bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};