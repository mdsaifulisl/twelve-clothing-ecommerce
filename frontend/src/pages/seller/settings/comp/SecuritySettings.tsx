import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../../../features/auth/useAuth";

interface SecuritySettingsProps {
  data: {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  };
  onChange: (field: string, value: string) => void;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  data,
  onChange,
}) => {
  const { user } = useAuth();

  // প্রতিটা ফিল্ডের জন্য আলাদা স্টেট, যাতে ইউজার চাইলে যেকোনো একটির চোখ আইকন অন করতে পারেন
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="space-y-4 max-w-md">
      <h3 className="text-sm font-bold text-primary border-b border-borderLight pb-2">
        Change Password
      </h3>

      {/* ইউজার ইমেইল প্রদর্শন */}
      <div className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm text-gray-600 font-medium">
        {user?.email}
      </div>

      {/* ১. বর্তমান পাসওয়ার্ড ফিল্ড */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Current Password *
        </label>
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            required
            placeholder="Enter current password"
            value={data.currentPassword || ""}
            onChange={(e) => onChange("currentPassword", e.target.value)}
            className="w-full pl-3.5 pr-10 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Toggle current password visibility"
          >
            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ২. নতুন পাসওয়ার্ড ফিল্ড */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          New Password *
        </label>
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            required
            placeholder="Enter new password"
            value={data.newPassword || ""}
            onChange={(e) => onChange("newPassword", e.target.value)}
            className="w-full pl-3.5 pr-10 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Toggle new password visibility"
          >
            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ৩. কনফার্ম নতুন পাসওয়ার্ড ফিল্ড */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Confirm New Password *
        </label>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            required
            placeholder="Re-enter new password"
            value={data.confirmPassword || ""}
            onChange={(e) => onChange("confirmPassword", e.target.value)}
            className="w-full pl-3.5 pr-10 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Toggle confirm password visibility"
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};