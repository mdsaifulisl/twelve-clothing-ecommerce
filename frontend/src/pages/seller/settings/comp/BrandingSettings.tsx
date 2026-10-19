import React from "react";
import { Upload } from "lucide-react";

interface BrandingSettingsProps {
  logoPreview: string;
  faviconPreview: string;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFaviconChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BrandingSettings: React.FC<BrandingSettingsProps> = ({
  logoPreview,
  faviconPreview,
  onLogoChange,
  onFaviconChange,
}) => {
  return (
    <div className="space-y-6 max-w-2xl">
      <h3 className="text-sm font-bold text-primary border-b border-borderLight pb-2">
        Website Logo & Favicon Upload
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* লোগো */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-700">Main Header Logo</label>
          <div className="border-2 border-dashed border-borderLight rounded-2xl p-4 text-center bg-surface hover:border-cardHeader transition-colors relative cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={onLogoChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex flex-col items-center justify-center space-y-1 pointer-events-none">
              <Upload className="w-5 h-5 text-cardHeader" />
              <p className="text-xs font-semibold text-primary">Click to upload Logo</p>
            </div>
          </div>
          {logoPreview && (
            <div className="p-3 bg-white rounded-xl border border-borderLight flex items-center justify-center h-20">
              <img src={logoPreview} alt="Logo" className="max-h-full object-contain" />
            </div>
          )}
        </div>

        {/* ফেভআইকন */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-700">Browser Favicon Icon</label>
          <div className="border-2 border-dashed border-borderLight rounded-2xl p-4 text-center bg-surface hover:border-cardHeader transition-colors relative cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={onFaviconChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex flex-col items-center justify-center space-y-1 pointer-events-none">
              <Upload className="w-5 h-5 text-cardHeader" />
              <p className="text-xs font-semibold text-primary">Click to upload Favicon</p>
            </div>
          </div>
          {faviconPreview && (
            <div className="p-3 bg-white rounded-xl border border-borderLight flex items-center justify-center h-20">
              <img src={faviconPreview} alt="Favicon" className="w-8 h-8 object-contain" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};





