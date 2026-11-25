import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSlider } from '../../../features/slider/useSlider';

interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  link: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 'default-western',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=1600',
    title: "Men's WESTERN Styles",
    subtitle: 'Discover the latest trend in Men Casuals',
    buttonText: 'SHOP NOW',
    link: '/men',
  },
  {
    id: 'default-eid',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1600',
    title: 'NEW EID COLLECTION',
    subtitle: 'Exclusive Festive Wear for Everyone',
    buttonText: 'EXPLORE ALL',
    link: '/all-item',
  },
];

export const HeroBanner: React.FC = () => {
  const { slides, loadSliders } = useSlider();
  const displaySlides: HeroSlide[] = slides.length > 0 ? slides : DEFAULT_SLIDES;
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const request = loadSliders();
    return () => request.abort();
  }, [loadSliders]);

  useEffect(() => {
    if (displaySlides.length < 2) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [displaySlides.length]);

  const activeSlideIndex = displaySlides.length ? currentSlide % displaySlides.length : 0;

  const prevSlide = () => {
    setCurrentSlide(activeSlideIndex === 0 ? displaySlides.length - 1 : activeSlideIndex - 1);
  };

  const nextSlide = () => {
    setCurrentSlide((activeSlideIndex + 1) % displaySlides.length);
  };

  return (
    <section className="relative w-full overflow-hidden bg-gray-900">
      {/* Slider Container */}
      <div 
        className="flex transition-transform duration-700 ease-out h-[280px] sm:h-[380px] md:h-[480px] lg:h-[550px]"
        style={{ transform: `translateX(-${activeSlideIndex * 100}%)` }}
      >
        {displaySlides.map((slide) => (
          <div key={slide.id} className="w-full flex-shrink-0 relative h-full overflow-hidden bg-gray-900">
            
            {/* Background Blur Image for Full Width Fill */}
            <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
              <img
                src={slide.image}
                alt=""
                className="h-full w-full scale-110 object-cover object-center opacity-40 blur-xl"
              />
            </div>

            {/* Main Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="relative z-10 w-full h-full object-cover sm:object-contain object-center"
            />

            {/* Dark Gradient Overlay so text is clearly readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-20" />

            {/* Banner Content Container */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-6 z-30">
              <h2 className="text-2xl sm:text-4xl md:text-6xl font-extrabold font-heading text-white tracking-wide drop-shadow-lg mb-2">
                {slide.title}
              </h2>
              <p className="text-xs sm:text-base md:text-lg text-gray-200 font-medium mb-6 drop-shadow max-w-xl">
                {slide.subtitle}
              </p>
              <Link
                to={slide.link}
                className="bg-[#F26522] hover:bg-[#d95213] text-white font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-md text-xs sm:text-sm md:text-base tracking-widest transition-all transform hover:scale-105 shadow-xl"
              >
                {slide.buttonText}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Navigation Buttons */}
      {displaySlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-900 p-2 rounded-full transition-colors shadow-lg z-40 cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-900 p-2 rounded-full transition-colors shadow-lg z-40 cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Slide Dots */}
      {displaySlides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-40">
          {displaySlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                activeSlideIndex === index ? 'bg-[#F26522] w-6' : 'bg-white/60 w-2.5'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroBanner;