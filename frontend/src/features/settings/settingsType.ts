export interface GeneralSettingsData {
  storeName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  whatsappNumber: string;
}

export interface SeoSettingsData {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
}

export interface BrandingSettingsData {
  logoUrl: string;
  faviconUrl: string;
}

export interface TelegramSettingsData {
  botTokenConfigured: boolean;
  chatId: string;
  notifyOnNewOrder: boolean;
}

export interface DeliverySettingsData {
  insideDhakaCharge: number;
  outsideDhakaCharge: number;
  freeDeliveryThreshold: number;
}

export interface PaymentSettingsData {
  codEnabled: boolean;
  bkashEnabled: boolean;
  bkashNumber: string;
}

export interface ManagedSettings {
  general: GeneralSettingsData;
  seo: SeoSettingsData;
  branding: BrandingSettingsData;
  telegram: TelegramSettingsData;
  delivery: DeliverySettingsData;
  payment: PaymentSettingsData;
  updatedAt?: string;
}

export type PublicStoreSettings = Pick<ManagedSettings, 'general' | 'seo' | 'branding' | 'delivery' | 'payment'>;

export type SettingsSection = 'general' | 'seo' | 'telegram' | 'delivery' | 'payment';

export interface SettingsState {
  data: ManagedSettings | null;
  publicData: PublicStoreSettings | null;
  isLoading: boolean;
  isPublicLoading: boolean;
  isSaving: boolean;
  isTestingTelegram: boolean;
  error: string | null;
  saved: boolean;
}
