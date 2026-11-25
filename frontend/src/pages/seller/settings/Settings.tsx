/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
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
import { useSettings } from "../../../features/settings/useSettings";
import type { SettingsSection } from "../../../features/settings/settingsType";
import { useAppDispatch } from "../../../app/hooks";
import { showAlertModal } from "../../../features/alert/alertSlice";
import { useAuth } from "../../../features/auth/useAuth";

const toAssetUrl = (path: string) =>
  path.startsWith("http") ? path : `http://localhost:5001${path}`;

export type UserRole = "Admin" | "Moderator" | "Editor" | "Support";

export const Settings: React.FC = () => {
  const dispatch = useAppDispatch();
  const settingsApi = useSettings();
  const { user, logout, changePassword, isLoading: isAuthLoading } = useAuth();

  // ব্যাকএন্ডের রোল ('admin' | 'moderator') কে টাইটেল কেসে রূপান্তর করা
  const normalizedRole = user?.role
    ? ((user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()) as UserRole)
    : "Admin";

  const isAdmin = normalizedRole === "Admin";
  // const isModerator = normalizedRole === "Moderator";

  // 🟢 রোল অনুযায়ী বাই-ডিফল্ট এক্টিভ ট্যাব নির্ধারণ (মডারেটর হলে সরাসরি security/password ট্যাব দেখাবে)
  const [activeTab, setActiveTab] = useState<
    "general" | "seo" | "branding" | "telegram" | "delivery" | "payment" | "security"
  >(isAdmin ? "general" : "security");

  const [logoFile, setLogoFile] = useState<File>();
  const [faviconFile, setFaviconFile] = useState<File>();

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
    ogImage:
      "https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?auto=format&fit=crop&q=80&w=1200",
  });

  const [logoPreview, setLogoPreview] = useState<string>("");
  const [faviconPreview, setFaviconPreview] = useState<string>("");

  const [telegram, setTelegram] = useState({
    botToken: "",
    botTokenConfigured: false,
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

  // রোল লোড হওয়ার পর এক্টিভ ট্যাব সিঙ্ক করা (মডারেটর অ্যাডমিন ট্যাবগুলোতে ঢুকতে পারবে না)
  useEffect(() => {
    if (!isAdmin && ["general", "seo", "branding", "telegram", "delivery", "payment"].includes(activeTab)) {
      setActiveTab("security");
    }
  }, [isAdmin, activeTab]);

  useEffect(() => {
    void settingsApi.load();
  }, [settingsApi.load]);

  useEffect(() => {
    if (settingsApi.error) {
      dispatch(
        showAlertModal({ message: settingsApi.error, type: "error", isToast: true })
      );
    }
  }, [dispatch, settingsApi.error]);

  useEffect(() => {
    const data = settingsApi.data;
    if (!data) return;
    setStoreInfo(data.general);
    setSeoInfo(data.seo);
    setLogoPreview(data.branding.logoUrl ? toAssetUrl(data.branding.logoUrl) : "");
    setFaviconPreview(
      data.branding.faviconUrl ? toAssetUrl(data.branding.faviconUrl) : ""
    );
    setTelegram((current) => ({
      ...current,
      botToken: "",
      botTokenConfigured: data.telegram.botTokenConfigured,
      chatId: data.telegram.chatId,
      notifyOnNewOrder: data.telegram.notifyOnNewOrder,
    }));
    setDelivery(data.delivery);
    setPayment(data.payment);
  }, [settingsApi.data]);

  const handleTestTelegram = async () => {
    if (
      telegram.botToken.trim() ||
      telegram.chatId !== settingsApi.data?.telegram.chatId
    ) {
      dispatch(
        showAlertModal({
          message: "Save the Telegram settings before sending a test alert.",
          type: "info",
          isToast: true,
        })
      );
      return;
    }
    try {
      const message = await settingsApi.testTelegramAlert();
      dispatch(showAlertModal({ message, type: "success", isToast: true }));
    } catch {
      // Handled via Redux error effect
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🟢 Change Password হ্যান্ডলার
    if (activeTab === "security") {
      if (!security.currentPassword || !security.newPassword || !security.confirmPassword) {
        dispatch(
          showAlertModal({
            message: "Please fill in all password fields.",
            type: "error",
            isToast: true,
          })
        );
        return;
      }

      if (security.newPassword.length < 6) {
        dispatch(
          showAlertModal({
            message: "New password must be at least 6 characters long.",
            type: "error",
            isToast: true,
          })
        );
        return;
      }

      if (security.newPassword !== security.confirmPassword) {
        dispatch(
          showAlertModal({
            message: "New password and confirm password do not match.",
            type: "error",
            isToast: true,
          })
        );
        return;
      }

      try {
        const msg = await changePassword({
          currentPassword: security.currentPassword,
          newPassword: security.newPassword,
        });

        await logout();

        setSecurity({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        dispatch(
          showAlertModal({
            message: msg || "Password changed successfully!",
            type: "success",
            isToast: true,
          })
        );
      } catch (err: any) {
        dispatch(
          showAlertModal({
            message: typeof err === "string" ? err : "Failed to change password.",
            type: "error",
            isToast: true,
          })
        );
      }
      return;
    }

    // অন্যান্য সেটিংস সেভ করা
    try {
      if (activeTab === "branding") {
        await settingsApi.saveBranding(logoFile, faviconFile);
        setLogoFile(undefined);
        setFaviconFile(undefined);
        dispatch(
          showAlertModal({
            message: "Branding settings saved successfully.",
            type: "success",
            isToast: true,
          })
        );
        return;
      }

      const section = activeTab as SettingsSection;
      const payload =
        section === "general"
          ? storeInfo
          : section === "seo"
          ? seoInfo
          : section === "telegram"
          ? {
              botToken: telegram.botToken,
              chatId: telegram.chatId,
              notifyOnNewOrder: telegram.notifyOnNewOrder,
            }
          : section === "delivery"
          ? delivery
          : payment;

      await settingsApi.save(section, payload);
      dispatch(
        showAlertModal({
          message: "Settings saved successfully.",
          type: "success",
          isToast: true,
        })
      );
    } catch {
      // Handled via Redux error effect
    }
  };

  // 🟢 শুধুমাত্র Admin-দের জন্য Delivery ও Payment ট্যাব বরাদ্দ করা হলো
  const allTabs = [
    { id: "general", label: "General", icon: Store, allowedRoles: ["Admin"] },
    { id: "seo", label: "SEO & Meta", icon: Globe, allowedRoles: ["Admin"] },
    { id: "branding", label: "Logo & Favicon", icon: ImageIcon, allowedRoles: ["Admin"] },
    { id: "telegram", label: "Telegram Alert", icon: Send, allowedRoles: ["Admin"] },
    { id: "delivery", label: "Delivery", icon: Truck, allowedRoles: ["Admin"] },
    { id: "payment", label: "Payment", icon: CreditCard, allowedRoles: ["Admin"] },
    {
      id: "security",
      label: "Change Password",
      icon: Lock,
      allowedRoles: ["Admin", "Moderator", "Editor", "Support"],
    },
  ];

  const visibleTabs = allTabs.filter((tab) =>
    tab.allowedRoles.includes(normalizedRole)
  );

  const isSubmitDisabled =
    activeTab === "security"
      ? isAuthLoading
      : settingsApi.isLoading || settingsApi.isSaving;

  return (
    <div className="space-y-6 font-sans pb-10">
      {/* পেজ হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">
            Settings & Security
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Logged in as:{" "}
            <span className="font-bold text-cardHeader">{normalizedRole}</span>
          </p>
        </div>

        {settingsApi.saved && activeTab !== "security" && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      {settingsApi.isLoading && (
        <div className="rounded-xl bg-white px-4 py-3 text-sm text-gray-500">
          Loading settings…
        </div>
      )}

      {/* রেস্ট্রিকশন অ্যালার্ট বার্তা */}
      {!isAdmin && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-800 text-xs font-medium">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            You are logged in as <strong>{normalizedRole}</strong>. Store configurations, delivery rates, and payment settings are restricted to Administrators.
          </span>
        </div>
      )}

      {/* নেভিগেশন ট্যাব লিস্ট */}
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
      <form
        onSubmit={handleSave}
        className="bg-white rounded-2xl border border-borderLight p-6 shadow-xs space-y-6"
      >
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
            onLogoChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setLogoFile(file);
                setLogoPreview(URL.createObjectURL(file));
              }
            }}
            onFaviconChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFaviconFile(file);
                setFaviconPreview(URL.createObjectURL(file));
              }
            }}
          />
        )}

        {activeTab === "telegram" && isAdmin && (
          <TelegramSettings
            data={telegram}
            onChange={(field, val) => setTelegram({ ...telegram, [field]: val })}
            onTest={handleTestTelegram}
            isTesting={settingsApi.isTestingTelegram}
          />
        )}

        {activeTab === "delivery" && isAdmin && (
          <DeliverySettings
            data={delivery}
            onChange={(field, val) => setDelivery({ ...delivery, [field]: val })}
          />
        )}

        {activeTab === "payment" && isAdmin && (
          <PaymentSettings
            data={payment}
            onChange={(field, val) => setPayment({ ...payment, [field]: val })}
          />
        )}

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
            disabled={isSubmitDisabled}
            className="flex items-center gap-2 px-6 py-2.5 bg-cardHeader text-white font-semibold text-sm rounded-xl hover:bg-cardAccent transition-colors shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>
              {activeTab === "security"
                ? isAuthLoading
                  ? "Updating Password…"
                  : "Update Password"
                : settingsApi.isSaving
                ? "Saving…"
                : "Save Changes"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;