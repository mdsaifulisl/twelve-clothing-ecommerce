/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Save,
  Store,
  Globe,
  Image as ImageIcon,
  Send,
  Truck,
  CreditCard,
  Lock,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

import { GeneralSettings } from "./comp/GeneralSettings";
import { SeoSettings } from "./comp/SeoSettings";
import { BrandingSettings } from "./comp/BrandingSettings";
import { TelegramSettings } from "./comp/TelegramSettings";
import { DeliverySettings } from "./comp/DeliverySettings";
import { PaymentSettings } from "./comp/PaymentSettings";
import { SecuritySettings } from "./comp/SecuritySettings";

// ইউজারের সম্ভাব্য রোলসমূহ
export type UserRole = "Admin" | "Moderator" | "Editor" | "Support";

export const Settings: React.FC = () => {
  // উদাহরণ হিসেবে বর্তমান লগইন করা ইউজারের রোল (Auth/Session context থেকে আসবে)
  const [currentUserRole] = useState<UserRole>("Admin");

  const isAdmin = currentUserRole === "Admin";
  const isModerator = currentUserRole === "Moderator";

  // রোল অনুযায়ী বাই-ডিফল্ট এক্টিভ ট্যাব নির্ধারণ
  const [activeTab, setActiveTab] = useState<
    "general" | "seo" | "branding" | "telegram" | "delivery" | "payment" | "security"
  >(isAdmin ? "general" : isModerator ? "delivery" : "security");

  const [isSaved, setIsSaved] = useState(false);

  // সেটিংস স্টেটসমূহ (সোশ্যাল মিডিয়া লিঙ্কসহ আপডেট করা হয়েছে)
const [storeInfo, setStoreInfo] = useState({
  storeName: "Twelve Clothing",
  tagline: "Elegance in Every Thread",
  contactEmail: "support@twelveclothing.com",
  contactPhone: "+880 1700-112233",
  address: "House 45, Road 11, Banani, Dhaka",
  facebookUrl: "https://facebook.com/twelveclothingbd",
  instagramUrl: "https://instagram.com/twelveclothingbd",
  tiktokUrl: "https://tiktok.com/@twelveclothingbd",
  youtubeUrl: "https://youtube.com/@twelveclothingbd",
  whatsappNumber: "+8801700112233",
});

  const [seoInfo, setSeoInfo] = useState({
    metaTitle: "Twelve Clothing | Premium Panjabi & Ethnic Wear",
    metaDescription: "Exclusive Panjabi, Shirts & Women's Wear at Twelve Clothing.",
    metaKeywords: "Twelve Clothing, Panjabi, Mens Fashion",
    ogImage: "https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?auto=format&fit=crop&q=80&w=1200",
  });

  const [logoPreview, setLogoPreview] = useState<string>("");
  const [faviconPreview, setFaviconPreview] = useState<string>("");

  const [telegram, setTelegram] = useState({
    botToken: "",
    chatId: "",
    notifyOnNewOrder: true,
  });

  const [delivery, setDelivery] = useState({
    insideDhakaCharge: 80,
    outsideDhakaCharge: 150,
    freeDeliveryThreshold: 5000,
  });

  const [payment, setPayment] = useState({
    codEnabled: true,
    bkashEnabled: true,
    bkashNumber: "+880 1700-112233",
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // টেলিগ্রাম টেস্ট
  const handleTestTelegram = async () => {
    if (!telegram.botToken || !telegram.chatId) {
      alert("Please provide Bot Token and Chat ID first.");
      return;
    }
    try {
      const message = encodeURIComponent("🎉 *Twelve Clothing Test Alert*\nBot connected successfully!");
      const res = await fetch(
        `https://api.telegram.org/bot${telegram.botToken}/sendMessage?chat_id=${telegram.chatId}&text=${message}&parse_mode=Markdown`
      );
      const data = await res.json();
      if (data.ok) alert("✅ Test message sent to Telegram!");
      else alert("❌ Error: Check Bot Token & Chat ID.");
    } catch {
      alert("❌ Failed to reach Telegram API.");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  /**
   * রোল ভিত্তিক ট্যাব ফিল্টারিং কনফিগারেশন:
   * - Admin: সব ট্যাব দেখতে ও এডিট করতে পারবে।
   * - Moderator: Delivery, Payment এবং Password পরিবর্তনের ট্যাব দেখতে পারবে।
   * - Editor / Support: শুধুমাত্র Password পরিবর্তনের ট্যাব পাবে।
   */
  const allTabs = [
    { id: "general", label: "General", icon: Store, allowedRoles: ["Admin"] },
    { id: "seo", label: "SEO & Meta", icon: Globe, allowedRoles: ["Admin"] },
    { id: "branding", label: "Logo & Favicon", icon: ImageIcon, allowedRoles: ["Admin"] },
    { id: "telegram", label: "Telegram Alert", icon: Send, allowedRoles: ["Admin"] },
    { id: "delivery", label: "Delivery", icon: Truck, allowedRoles: ["Admin", "Moderator"] },
    { id: "payment", label: "Payment", icon: CreditCard, allowedRoles: ["Admin", "Moderator"] },
    { id: "security", label: "Change Password", icon: Lock, allowedRoles: ["Admin", "Moderator", "Editor", "Support"] },
  ];

  // বর্তমান ইউজারের রোল অনুযায়ী অনুমোদনপ্রাপ্ত ট্যাবসমূহ ফিল্টার
  const visibleTabs = allTabs.filter((tab) => tab.allowedRoles.includes(currentUserRole));

  return (
    <div className="space-y-6 font-sans pb-10">
      {/* পেজ হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">
            Settings & Security
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Logged in as: <span className="font-bold text-cardHeader">{currentUserRole}</span>
          </p>
        </div>

        {isSaved && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      {/* রেস্ট্রিকশন অ্যালার্ট বার্তা (অ্যাডমিন ছাড়া অন্যান্য রোলের জন্য) */}
      {!isAdmin && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-800 text-xs font-medium">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            You are logged in as <strong>{currentUserRole}</strong>. Core store configurations (General, SEO, Telegram, Branding) are restricted to Administrators.
          </span>
        </div>
      )}

      {/* নেভিগেশন ট্যাব লিস্ট (ডাইনামিক্যালি পারমিশন অনুযায়ী ফিল্টারড) */}
      <div className="flex flex-wrap items-center gap-2 border-b border-borderLight pb-3">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-cardHeader text-white shadow-xs"
                  : "bg-white text-gray-600 border border-borderLight hover:bg-surface"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* সেটিংস ফর্ম ও কম্পোনেন্ট রেন্ডারিং */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-borderLight p-6 shadow-xs space-y-6">
        {activeTab === "general" && isAdmin && (
          <GeneralSettings
            data={storeInfo}
            onChange={(field, val) => setStoreInfo({ ...storeInfo, [field]: val })}
          />
        )}

        {activeTab === "seo" && isAdmin && (
          <SeoSettings
            data={seoInfo}
            onChange={(field, val) => setSeoInfo({ ...seoInfo, [field]: val })}
          />
        )}

        {activeTab === "branding" && isAdmin && (
          <BrandingSettings
            logoPreview={logoPreview}
            faviconPreview={faviconPreview}
            onLogoChange={(e) => e.target.files?.[0] && setLogoPreview(URL.createObjectURL(e.target.files[0]))}
            onFaviconChange={(e) => e.target.files?.[0] && setFaviconPreview(URL.createObjectURL(e.target.files[0]))}
          />
        )}

        {activeTab === "telegram" && isAdmin && (
          <TelegramSettings
            data={telegram}
            onChange={(field, val) => setTelegram({ ...telegram, [field]: val })}
            onTest={handleTestTelegram}
          />
        )}

        {/* Delivery Settings - Admin ও Moderator উভয়ই পাবে */}
        {activeTab === "delivery" && (isAdmin || isModerator) && (
          <DeliverySettings
            data={delivery}
            onChange={(field, val) => setDelivery({ ...delivery, [field]: val })}
          />
        )}

        {/* Payment Settings - Admin ও Moderator উভয়ই পাবে */}
        {activeTab === "payment" && (isAdmin || isModerator) && (
          <PaymentSettings
            data={payment}
            onChange={(field, val) => setPayment({ ...payment, [field]: val })}
          />
        )}

        {/* Change Password / Security - সকল রোল দেখতে ও এডিট করতে পারবে */}
        {activeTab === "security" && (
          <SecuritySettings
            data={security}
            onChange={(field, val) => setSecurity({ ...security, [field]: val })}
          />
        )}

        {/* সেভ বাটন */}
        <div className="pt-4 border-t border-borderLight flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-cardHeader text-white font-semibold text-sm rounded-xl hover:bg-cardAccent transition-colors shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;