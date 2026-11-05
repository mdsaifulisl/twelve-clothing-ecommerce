import { Prisma } from '@prisma/client';
import prisma from '../config/prisma.js';
import { encryptTelegramToken } from '../utils/settings-crypto.util.js';
import { deleteLocalFile } from '../utils/file.util.js';
import type { z } from 'zod';
import { settingsSchemas } from '../validations/settings.validation.js';

const SETTINGS_ID = 'singleton';

export const defaultStoreSettings = {
  general: {
    storeName: 'Twelve Clothing', tagline: 'Elegance in Every Thread',
    contactEmail: 'support@twelveclothing.com', contactPhone: '+880 1700-112233',
    address: 'House 45, Road 11, Banani, Dhaka', facebookUrl: 'https://facebook.com/twelveclothingbd',
    instagramUrl: 'https://instagram.com/twelveclothingbd', tiktokUrl: 'https://tiktok.com/@twelveclothingbd',
    youtubeUrl: 'https://youtube.com/@twelveclothingbd', whatsappNumber: '+8801700112233',
  },
  seo: {
    metaTitle: 'Twelve Clothing | Premium Panjabi & Ethnic Wear',
    metaDescription: "Exclusive Panjabi, Shirts & Women's Wear at Twelve Clothing.",
    metaKeywords: 'Twelve Clothing, Panjabi, Mens Fashion',
    ogImage: 'https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?auto=format&fit=crop&q=80&w=1200',
  },
  branding: { logoUrl: '', faviconUrl: '' },
  telegramBotTokenEncrypted: null as string | null,
  delivery: { insideDhakaCharge: 80, outsideDhakaCharge: 150, freeDeliveryThreshold: 5000 },
  payment: { codEnabled: true, bkashEnabled: true, bkashNumber: '+880 1700-112233' },
};

export const ensureStoreSettings = async () => prisma.storeSettings.upsert({
  where: { id: SETTINGS_ID },
  create: {
    id: SETTINGS_ID,
    general: defaultStoreSettings.general,
    seo: defaultStoreSettings.seo,
    branding: defaultStoreSettings.branding,
    delivery: defaultStoreSettings.delivery,
    payment: defaultStoreSettings.payment,
  },
  update: {},
});

export const getPublicSettings = async () => {
  const row = await prisma.storeSettings.findUnique({ where: { id: SETTINGS_ID } });
  if (!row) return {
    general: defaultStoreSettings.general, seo: defaultStoreSettings.seo,
    branding: defaultStoreSettings.branding, delivery: defaultStoreSettings.delivery,
    payment: defaultStoreSettings.payment,
  };
  return { general: row.general, seo: row.seo, branding: row.branding, delivery: row.delivery, payment: row.payment };
};

export const getManagedSettings = async () => {
  const row = await prisma.storeSettings.findUnique({ where: { id: SETTINGS_ID } });
  if (!row) return {
    general: defaultStoreSettings.general, seo: defaultStoreSettings.seo,
    branding: defaultStoreSettings.branding,
    telegram: { botTokenConfigured: false, chatId: '', notifyOnNewOrder: true },
    delivery: defaultStoreSettings.delivery, payment: defaultStoreSettings.payment,
  };
  return {
    general: row.general, seo: row.seo, branding: row.branding,
    telegram: {
      botTokenConfigured: Boolean(row.telegramBotTokenEncrypted),
      chatId: row.telegramChatId ?? '', notifyOnNewOrder: row.notifyOnNewOrder,
    },
    delivery: row.delivery, payment: row.payment, updatedAt: row.updatedAt,
  };
};

type Section = keyof typeof settingsSchemas;
type SectionInput<T extends Section> = z.infer<(typeof settingsSchemas)[T]>;

export const updateSettingsSection = async <T extends Section>(section: T, input: SectionInput<T>) => {
  const parsed = settingsSchemas[section].parse(input) as Record<string, unknown>;
  const row = await ensureStoreSettings();
  if (section === 'telegram') {
    const telegram = parsed as { botToken?: string; chatId?: string; notifyOnNewOrder: boolean };
    const encrypted = telegram.botToken ? encryptTelegramToken(telegram.botToken) : row.telegramBotTokenEncrypted;
    return prisma.storeSettings.update({
      where: { id: SETTINGS_ID },
      data: { telegramBotTokenEncrypted: encrypted, telegramChatId: telegram.chatId || null, notifyOnNewOrder: telegram.notifyOnNewOrder },
    }).then((updated: { telegramBotTokenEncrypted: string | null; telegramChatId: string | null; notifyOnNewOrder: boolean }) => ({ botTokenConfigured: Boolean(updated.telegramBotTokenEncrypted), chatId: updated.telegramChatId ?? '', notifyOnNewOrder: updated.notifyOnNewOrder }));
  }
  const updated = await prisma.storeSettings.update({
    where: { id: SETTINGS_ID }, data: { [section]: parsed as Prisma.InputJsonValue },
  });
  return updated[section];
};

export const updateBrandingImages = async (input: { logoUrl?: string; faviconUrl?: string }) => {
  const row = await ensureStoreSettings();
  const old = row.branding as { logoUrl?: string; faviconUrl?: string };
  const branding = { ...old, ...input };
  const updated = await prisma.storeSettings.update({ where: { id: SETTINGS_ID }, data: { branding } });
  for (const key of ['logoUrl', 'faviconUrl'] as const) {
    const previous = old[key];
    if (input[key] && previous?.startsWith('/uploads/settings/') && previous !== input[key]) deleteLocalFile(previous);
  }
  return updated.branding;
};
