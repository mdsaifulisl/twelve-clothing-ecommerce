import React from "react";
import { MessageCircle, Globe } from "lucide-react";

// Custom SVG Icons
const FacebookIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const TikTokIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 1 1-2.896-2.896c.244 0 .482.03.71.087V9.336a6.326 6.326 0 0 0-.71-.04 6.341 6.341 0 1 0 6.341 6.342V8.472a8.21 8.21 0 0 0 4.77 1.526V6.553a4.783 4.783 0 0 1-1.000 0z" />
  </svg>
);

const YoutubeIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

interface GeneralSettingsProps {
  data: {
    storeName: string;
    tagline: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    facebookUrl?: string;
    instagramUrl?: string;
    whatsappNumber?: string;
    youtubeUrl?: string;
    tiktokUrl?: string;
  };
  onChange: (field: string, value: string) => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-primary border-b border-borderLight pb-2">
          Business Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Store Name *
            </label>
            <input
              type="text"
              required
              value={data.storeName}
              onChange={(e) => onChange("storeName", e.target.value)}
              className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={data.tagline}
              onChange={(e) => onChange("tagline", e.target.value)}
              className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Support Email *
            </label>
            <input
              type="email"
              required
              value={data.contactEmail}
              onChange={(e) => onChange("contactEmail", e.target.value)}
              className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Support Phone *
            </label>
            <input
              type="text"
              required
              value={data.contactPhone}
              onChange={(e) => onChange("contactPhone", e.target.value)}
              className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Store Address
          </label>
          <textarea
            rows={2}
            value={data.address}
            onChange={(e) => onChange("address", e.target.value)}
            className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
          />
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-bold text-primary border-b border-borderLight pb-2 flex items-center gap-2">
          <Globe className="w-4 h-4 text-cardHeader" /> Social Media Links
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Facebook */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <FacebookIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Facebook Page URL</span>
            </label>
            <input
              type="url"
              placeholder="https://facebook.com/twelveclothingbd"
              value={data.facebookUrl || ""}
              onChange={(e) => onChange("facebookUrl", e.target.value)}
              className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <InstagramIcon className="w-3.5 h-3.5 text-pink-600 shrink-0" />
              <span>Instagram Profile URL</span>
            </label>
            <input
              type="url"
              placeholder="https://instagram.com/twelveclothingbd"
              value={data.instagramUrl || ""}
              onChange={(e) => onChange("instagramUrl", e.target.value)}
              className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
            />
          </div>

          {/* TikTok */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <TikTokIcon className="w-3.5 h-3.5 text-black shrink-0" />
              <span>TikTok Profile URL</span>
            </label>
            <input
              type="url"
              placeholder="https://tiktok.com/@twelveclothingbd"
              value={data.tiktokUrl || ""}
              onChange={(e) => onChange("tiktokUrl", e.target.value)}
              className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
            />
          </div>

          {/* YouTube */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <YoutubeIcon className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>YouTube Channel URL</span>
            </label>
            <input
              type="url"
              placeholder="https://youtube.com/@twelveclothingbd"
              value={data.youtubeUrl || ""}
              onChange={(e) => onChange("youtubeUrl", e.target.value)}
              className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
            />
          </div>

          {/* WhatsApp */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-green-600 shrink-0" />
              <span>WhatsApp Direct Link / Number</span>
            </label>
            <input
              type="text"
              placeholder="+8801700000000 or https://wa.me/8801700000000"
              value={data.whatsappNumber || ""}
              onChange={(e) => onChange("whatsappNumber", e.target.value)}
              className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
            />
          </div>
        </div>
      </div>
    </div>
  );
};