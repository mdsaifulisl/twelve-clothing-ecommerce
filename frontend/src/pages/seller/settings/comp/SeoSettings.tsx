import React from "react";

interface SeoSettingsProps {
  data: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
  };
  onChange: (field: string, value: string) => void;
}

export const SeoSettings: React.FC<SeoSettingsProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4 max-w-2xl">
      <h3 className="text-sm font-bold text-primary border-b border-borderLight pb-2">
        SEO & Meta Tags Setup
      </h3>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Meta Title *</label>
        <input
          type="text"
          required
          value={data.metaTitle}
          onChange={(e) => onChange("metaTitle", e.target.value)}
          placeholder="Google Search Title..."
          className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Meta Description *</label>
        <textarea
          rows={3}
          required
          value={data.metaDescription}
          onChange={(e) => onChange("metaDescription", e.target.value)}
          placeholder="Summary for search engines..."
          className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Meta Keywords</label>
        <input
          type="text"
          value={data.metaKeywords}
          onChange={(e) => onChange("metaKeywords", e.target.value)}
          placeholder="Panjabi, Clothing, Fashion"
          className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
        />
      </div>

      
    </div>
  );
};