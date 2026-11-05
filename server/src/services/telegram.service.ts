import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { decryptTelegramToken } from '../utils/settings-crypto.util.js';

interface TelegramOrderSummary {
  orderCode: string;
  status: string;
  paymentMethod: string;
  totalAmount: { toFixed: (digits: number) => string };
  items: Array<{ productTitle: string; quantity: number }>;
}

const readTelegramConfig = async () => prisma.storeSettings.findUnique({
  where: { id: 'singleton' },
  select: { telegramBotTokenEncrypted: true, telegramChatId: true, notifyOnNewOrder: true },
});

const sendMessage = async (token: string, chatId: string, text: string) => {
  let response: globalThis.Response;
  try {
    response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    throw new AppError('Could not reach Telegram. Please try again.', 502);
  }

  if (!response.ok) throw new AppError('Telegram rejected the message. Check the saved bot token and chat ID.', 502);
  const result = await response.json().catch(() => null) as { ok?: boolean } | null;
  if (!result?.ok) throw new AppError('Telegram rejected the message. Check the saved bot token and chat ID.', 502);
};

const getCredentials = async (required: boolean) => {
  const settings = await readTelegramConfig();
  if (!settings?.telegramBotTokenEncrypted || !settings.telegramChatId) {
    if (required) throw new AppError('Save a Telegram bot token and chat ID before sending a test alert.', 400);
    return null;
  }
  return { token: decryptTelegramToken(settings.telegramBotTokenEncrypted), chatId: settings.telegramChatId, notifyOnNewOrder: settings.notifyOnNewOrder };
};

export const sendTelegramTestAlert = async () => {
  const credentials = await getCredentials(true);
  if (!credentials) return false;
  await sendMessage(credentials.token, credentials.chatId, 'Twelve Clothing test alert. Telegram notifications are connected.');
  return true;
};

export const notifyTelegramNewOrder = async (order: TelegramOrderSummary): Promise<void> => {
  try {
    const credentials = await getCredentials(false);
    if (!credentials || !credentials.notifyOnNewOrder) return;
    const itemSummary = order.items.map((item) => `• ${item.productTitle} × ${item.quantity}`).join('\n');
    const text = [
      'New order received',
      `Order: ${order.orderCode}`,
      `Status: ${order.status}`,
      `Payment method: ${order.paymentMethod}`,
      `Total: ৳${order.totalAmount.toFixed(2)}`,
      'Items:',
      itemSummary,
    ].join('\n').slice(0, 4000);
    await sendMessage(credentials.token, credentials.chatId, text);
  } catch {
    // Telegram is best-effort: a notification problem must never invalidate a committed order.
    console.warn('[TELEGRAM] New-order notification was skipped or could not be delivered.');
  }
};
