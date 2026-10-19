import React from "react";

interface SecuritySettingsProps {
  data: {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  };
  onChange: (field: string, value: string) => void;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4 max-w-md">
      <h3 className="text-sm font-bold text-primary border-b border-borderLight pb-2">
        Change Password
      </h3>

      {/* ১. বর্তমান পাসওয়ার্ড ফিল্ড */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Current Password *
        </label>
        <input
          type="password"
          required
          placeholder="Enter current password"
          value={data.currentPassword || ""}
          onChange={(e) => onChange("currentPassword", e.target.value)}
          className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
        />
      </div>

      {/* ২. নতুন পাসওয়ার্ড ফিল্ড */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          New Password *
        </label>
        <input
          type="password"
          required
          placeholder="Enter new password"
          value={data.newPassword || ""}
          onChange={(e) => onChange("newPassword", e.target.value)}
          className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
        />
      </div>

      {/* ৩. কনফার্ম নতুন পাসওয়ার্ড ফিল্ড */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Confirm New Password *
        </label>
        <input
          type="password"
          required
          placeholder="Re-enter new password"
          value={data.confirmPassword || ""}
          onChange={(e) => onChange("confirmPassword", e.target.value)}
          className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
        />
      </div>
    </div>
  );
};