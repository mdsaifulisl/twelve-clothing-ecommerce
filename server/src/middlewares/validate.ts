import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';
import path from 'path';
import fs from 'fs';
import { deleteLocalFile } from '../utils/file.util.js';
import { AppError } from '../utils/AppError.js';

// Request-এ কাস্টম প্রপার্টি টাইপ অ্যাড করা
declare global {
  namespace Express {
    interface Request {
      uploadFolder?: string;
    }
  }
}

const extractImageSrcs = (htmlContent: string): string[] => {
  if (!htmlContent) return [];
  const imgTagRegex = /<img[^>]+src=["']([^"']+)["']/g;
  const matches: string[] = [];
  let match;
  while ((match = imgTagRegex.exec(htmlContent)) !== null) {
    if (!match[1].startsWith('data:image')) {
      matches.push(match[1]);
    }
  }
  return matches;
};

const cleanupFile = (imageUrlOrPath: string, folderName = 'blogs') => {
  if (!imageUrlOrPath) return;

  try {
    const cleanUrl = imageUrlOrPath.split('?')[0];
    const filename = path.basename(cleanUrl);

    if (!filename) return;

    const possiblePaths = [
      path.join(process.cwd(), 'public', 'uploads', folderName, filename),
      path.join(process.cwd(), 'uploads', folderName, filename),
      path.join(process.cwd(), imageUrlOrPath),
    ];

    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        deleteLocalFile(filePath);
        break;
      }
    }
  } catch (error) {
    console.error('Failed to cleanup file:', error);
  }
};

export const validate =
  (schema: ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 🟢 যেহেতু আপনার স্কিমা সরাসরি req.body চেক করার জন্য, তাই শুধু req.body পার্স করুন
      req.body = await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      const folder = req.uploadFolder || 'product'; // 'blogs' এর পরিবর্তে প্রজেক্ট অনুযায়ী 'product' বা ডাইনামিক ফোল্ডার

      // ১. আপলোড করা ফাইল বা ইমেজ ক্লিনআপ
      if (req.file?.path) {
        cleanupFile(req.file.path, folder);
      }
      if (req.body?.image) {
        if (Array.isArray(req.body.image)) {
          req.body.image.forEach((img: string) => cleanupFile(img, folder));
        } else {
          cleanupFile(req.body.image, folder);
        }
      }

      // ২. ZodError হ্যান্ডলিং
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return next(
          new AppError(
            formattedErrors.map(({ field, message }) => `${field}: ${message}`).join('; '),
            400,
          ),
        );
      }

      return next(error);
    }
  };
