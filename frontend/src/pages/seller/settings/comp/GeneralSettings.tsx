import React from "react";

interface GeneralSettingsProps {
  data: {
    storeName: string;
    tagline: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
  };
  onChange: (field: string, value: string) => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4 max-w-2xl">
      <h3 className="text-sm font-bold text-primary border-b border-borderLight pb-2">
        Business Information
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Store Name *</label>
          <input
            type="text"
            required
            value={data.storeName}
            onChange={(e) => onChange("storeName", e.target.value)}
            className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Tagline</label>
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
          <label className="block text-xs font-semibold text-gray-700 mb-1">Support Email *</label>
          <input
            type="email"
            required
            value={data.contactEmail}
            onChange={(e) => onChange("contactEmail", e.target.value)}
            className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Support Phone *</label>
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
        <label className="block text-xs font-semibold text-gray-700 mb-1">Store Address</label>
        <textarea
          rows={2}
          value={data.address}
          onChange={(e) => onChange("address", e.target.value)}
          className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
        />
      </div>
    </div>
  );
};