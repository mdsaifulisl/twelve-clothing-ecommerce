/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface PaymentSettingsProps {
  data: {
    codEnabled: boolean;
    bkashEnabled: boolean;
    bkashNumber: string;
  };
  onChange: (field: string, value: any) => void;
}

export const PaymentSettings: React.FC<PaymentSettingsProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4 max-w-2xl">
      <h3 className="text-sm font-bold text-primary border-b border-borderLight pb-2">
        Payment Methods
      </h3>

      <div className="p-4 bg-surface rounded-2xl border border-borderLight flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-primary">Cash on Delivery (COD)</h4>
          <p className="text-xs text-gray-500">Allow customers to pay upon receiving products.</p>
        </div>
        <input
          type="checkbox"
          checked={data.codEnabled}
          onChange={(e) => onChange("codEnabled", e.target.checked)}
          className="w-5 h-5 accent-cardHeader cursor-pointer"
        />
      </div>

      <div className="p-4 bg-surface rounded-2xl border border-borderLight space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-primary">bKash Payment</h4>
            <p className="text-xs text-gray-500">Manual bKash payment method.</p>
          </div>
          <input
            type="checkbox"
            checked={data.bkashEnabled}
            onChange={(e) => onChange("bkashEnabled", e.target.checked)}
            className="w-5 h-5 accent-cardHeader cursor-pointer"
          />
        </div>

        {data.bkashEnabled && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">bKash Number</label>
            <input
              type="text"
              value={data.bkashNumber}
              onChange={(e) => onChange("bkashNumber", e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-borderLight rounded-xl text-sm font-mono outline-none focus:border-cardHeader"
            />
          </div>
        )}
      </div>
    </div>
  );
};