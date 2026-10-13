import React, { useState } from 'react';
import { Play, X } from 'lucide-react';

export const BrandVideoBanner: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="w-full my-8 md:my-14">
      <div className="relative w-full h-[350px] sm:h-[450px] md:h-[550px] bg-gray-900 overflow-hidden">
        {!isPlaying ? (
          <>
            {/* Banner Background Image */}
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1600"
              alt="XII.SQD Brand Banner"
              className="w-full h-full object-cover object-center opacity-85"
            />

            {/* Dark Overlay for Text Visibility */}
            <div className="absolute inset-0 bg-black/25" />

            {/* Banner Content (Title & Subtitle) */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-12 md:p-16 text-white max-w-7xl mx-auto w-full">
              {/* Brand Title Left Bottom */}
              <div className="mt-auto space-y-2">
                <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-heading tracking-widest text-white">
                  XII.SQD
                </h2>
                <p className="text-sm sm:text-lg md:text-xl font-medium text-gray-200 max-w-md">
                  Bold, Modern Casuals for confident self-expression
                </p>
              </div>

              {/* Play Button Centered */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F26522] hover:bg-[#d95213] text-white rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-2xl group focus:outline-none"
                  aria-label="Play Brand Video"
                >
                  <Play size={32} className="ml-1 fill-white group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Embedded Video Container when clicked */
          <div className="relative w-full h-full bg-black">
            <button
              onClick={() => setIsPlaying(false)}
              className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-primary p-2 rounded-full transition-colors"
              aria-label="Close Video"
            >
              <X size={24} />
            </button>
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/h1JDjiyoIM4?autoplay=1&si=Dd81nq213h-HNp_6"
              title="XII.SQD Brand Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </section>
  );
};