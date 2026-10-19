import React from "react";

interface DeliverySettingsProps {
  data: {
    insideDhakaCharge: number;
    outsideDhakaCharge: number;
    freeDeliveryThreshold: number;
  };
  onChange: (field: string, value: number) => void;
}

export const DeliverySettings: React.FC<DeliverySettingsProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4 max-w-2xl">
      <h3 className="text-sm font-bold text-primary border-b border-borderLight pb-2">
        Shipping Rates & Thresholds
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Inside Dhaka Charge (৳)</label>
          <input
            type="number"
            value={data.insideDhakaCharge}
            onChange={(e) => onChange("insideDhakaCharge", Number(e.target.value))}
            className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Outside Dhaka Charge (৳)</label>
          <input
            type="number"
            value={data.outsideDhakaCharge}
            onChange={(e) => onChange("outsideDhakaCharge", Number(e.target.value))}
            className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Free Delivery Minimum Amount (৳)</label>
        <input
          type="number"
          value={data.freeDeliveryThreshold}
          onChange={(e) => onChange("freeDeliveryThreshold", Number(e.target.value))}
          className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
        />
      </div>
    </div>
  );
};