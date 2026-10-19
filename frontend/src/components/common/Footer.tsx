
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full mt-12 bg-white border-t border-borderLight">
      {/* Store Location Banner */}
      <div className="relative w-full h-[280px] sm:h-[350px] md:h-[400px] bg-gray-100 overflow-hidden">
        {/* Background Overlay Image */}
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600"
          alt="Store Location"
          className="w-full h-full object-cover object-center opacity-30"
        />

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <Link
            to="/stores"
            className="bg-[#F26522] hover:bg-[#d95213] text-white font-bold px-6 py-2.5 rounded text-xs sm:text-sm tracking-wider uppercase transition-all transform hover:scale-105 shadow-md mb-6"
          >
            Find Stores
          </Link>

          <div className="border-4 border-[#E0A769]/60 px-8 py-4 sm:px-16 sm:py-6 bg-white/40 backdrop-blur-xs">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-heading text-[#D28238] tracking-[0.2em] uppercase">
              STORE LOCATION
            </h2>
          </div>
        </div>
      </div>

      {/* Footer Links & Social Media Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-gray-600 font-medium tracking-wider uppercase mb-6 text-center">
          <Link to="/about" className="hover:text-[#F26522] transition-colors">About Us</Link>
          <span>•</span>
          <Link to="/stores" className="hover:text-[#F26522] transition-colors">Store Locator</Link>
          <span>•</span>
          <Link to="/contact" className="hover:text-[#F26522] transition-colors">Contact Us</Link>
          <span>•</span>
          <Link to="/privacy-policy" className="hover:text-[#F26522] transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-[#F26522] transition-colors">Terms & Conditions</Link>
          <span>•</span>
          <Link to="/faq" className="hover:text-[#F26522] transition-colors">FAQ</Link>
        </div>

        {/* Social Icons with SVG */}
        <div className="flex items-center justify-center space-x-6 text-primary mb-6">
          
          {/* Facebook SVG Icon */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#F26522] transition-colors p-1"
            aria-label="Facebook"
          >
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>

          {/* Instagram SVG Icon */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#F26522] transition-colors p-1"
            aria-label="Instagram"
          >
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>

          {/* YouTube SVG Icon */}
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#F26522] transition-colors p-1"
            aria-label="YouTube"
          >
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>

          {/* TikTok Text / SVG */}
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#F26522] transition-colors p-1 text-xs font-bold"
            aria-label="TikTok"
          >
            TikTok
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center border-t border-gray-100 pt-6">
          <p className="text-[11px] text-gray-400 font-light">
            © {new Date().getFullYear()} Panjabi Order Management System. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
    );
}