/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Send } from "lucide-react";

interface TelegramSettingsProps {
  data: {
    botToken: string;
    botTokenConfigured?: boolean;
    chatId: string;
    notifyOnNewOrder: boolean;
  };
  onChange: (field: string, value: any) => void;
  onTest: () => void;
  isTesting?: boolean;
}

export const TelegramSettings: React.FC<TelegramSettingsProps> = ({
  data,
  onChange,
  onTest,
  isTesting = false,
}) => {
  return (
    <div className="space-y-4 max-w-2xl">
      <div className="border-b border-borderLight pb-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-primary flex items-center gap-1.5">
            <Send className="w-4 h-4 text-blue-500" /> Telegram Order Notification Bot
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Receive instant alerts in your Telegram group when a new order is placed.
          </p>
        </div>
      </div>

      <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Telegram Bot Token *</label>
          <input
            type="password"
            value={data.botToken}
            onChange={(e) => onChange("botToken", e.target.value)}
            placeholder={data.botTokenConfigured ? "Saved securely — leave blank to keep current token" : "Enter Telegram bot token"}
            className="w-full px-3.5 py-2 bg-white border border-borderLight rounded-xl text-sm font-mono outline-none focus:border-cardHeader"
          />
          {data.botTokenConfigured && <p className="text-[11px] text-green-700 mt-1">A bot token is saved securely. It is never returned by the server.</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Telegram Chat ID / Group ID *</label>
          <input
            type="text"
            required
            value={data.chatId}
            onChange={(e) => onChange("chatId", e.target.value)}
            placeholder="e.g. -100123456789"
            className="w-full px-3.5 py-2 bg-white border border-borderLight rounded-xl text-sm font-mono outline-none focus:border-cardHeader"
          />
        </div>

        <div className="pt-2 flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={data.notifyOnNewOrder}
              onChange={(e) => onChange("notifyOnNewOrder", e.target.checked)}
              className="w-4 h-4 accent-cardHeader"
            />
            <span>Send Alert on New Order</span>
          </label>

          <button
            type="button"
            onClick={onTest}
            disabled={isTesting}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTesting ? "Sending…" : "Test Telegram Alert"}
          </button>
        </div>
      </div>
    </div>
  );
};
