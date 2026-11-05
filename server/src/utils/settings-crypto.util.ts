import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { AppError } from './AppError.js';

const getEncryptionKey = () => {
  const value = process.env.TELEGRAM_TOKEN_ENCRYPTION_KEY;
  if (!value || !/^[a-fA-F0-9]{64}$/.test(value)) {
    throw new AppError('Telegram token encryption is not configured. Set TELEGRAM_TOKEN_ENCRYPTION_KEY to a 64-character hexadecimal key in server/.env, then restart the backend.', 503);
  }
  return Buffer.from(value, 'hex');
};

export const encryptTelegramToken = (token: string): string => {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', getEncryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);
  return `${iv.toString('hex')}.${cipher.getAuthTag().toString('hex')}.${ciphertext.toString('hex')}`;
};

export const decryptTelegramToken = (payload: string): string => {
  const [ivHex, tagHex, ciphertextHex] = payload.split('.');
  if (!ivHex || !tagHex || !ciphertextHex) throw new AppError('Stored Telegram token cannot be decrypted.', 500);
  const decipher = createDecipheriv('aes-256-gcm', getEncryptionKey(), Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  return Buffer.concat([decipher.update(Buffer.from(ciphertextHex, 'hex')), decipher.final()]).toString('utf8');
};
