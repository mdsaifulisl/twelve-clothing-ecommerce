import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// 🟢 ES Module এর জন্য __dirname রি-ক্রিয়েট করা হলো
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TypeScript এর Request ইন্টারফেসে uploadFolder প্রপার্টি যোগ করার জন্য
declare global {
  namespace Express {
    interface Request {
      uploadFolder?: string;
    }
  }
}

// মেমোরি স্টোরেজ কনফিগারেশন
const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Please upload a valid image file!'));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // সর্বোচ্চ ৫ এমবি
  fileFilter,
});

const compressAndWriteImage = async (file: Express.Multer.File, folderName: string, targetDir: string) => {
  const filename = `img-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
  const outputPath = path.join(targetDir, filename);
  let quality = 80;
  let width = 1200;
  let compressedBuffer: Buffer;

  do {
    compressedBuffer = await sharp(file.buffer)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();

    if (compressedBuffer.length > 300 * 1024) {
      if (quality > 30) quality -= 10;
      else width = Math.floor(width * 0.8);
    }
  } while (compressedBuffer.length > 300 * 1024 && quality > 10);

  fs.writeFileSync(outputPath, compressedBuffer);
  return `/uploads/${folderName}/${filename}`;
};

// Sharp দিয়ে কম্প্রেস ও সেভ করার মিডলওয়্যার
export const compressAndSaveImages = async (req: Request, res: Response, next: NextFunction) => {
  const files = (req.files as Express.Multer.File[]) || [];
  if (files.length === 0) return next();

  try {
    const folderName = req.uploadFolder || 'general';
    const targetDir = path.join(__dirname, '../../uploads', folderName);
    
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const processedImagePaths: string[] = [];
    for (const file of files) processedImagePaths.push(await compressAndWriteImage(file, folderName, targetDir));

    // প্রসেস হওয়া পাথগুলো req.body.image এ যুক্ত করে দেওয়া
    req.body.image = processedImagePaths;
    next();
  } catch (error) {
    console.error('Image processing error:', error);
    return res.status(500).json({ success: false, message: 'Image processing and upload failed' });
  }
};

/** Process named multipart fields through the same shared Sharp/WebP pipeline. */
export const compressAndSaveImageFields = (fieldToBodyKey: Record<string, string>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const files = (req.files as Record<string, Express.Multer.File[]> | undefined) || {};
    const uploadedEntries = Object.entries(fieldToBodyKey)
      .flatMap(([field, bodyKey]) => files[field]?.[0] ? [{ field, bodyKey, file: files[field][0] }] : []);
    if (uploadedEntries.length === 0) return next();

    try {
      const folderName = req.uploadFolder || 'general';
      const targetDir = path.join(__dirname, '../../uploads', folderName);
      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

      const processed: Record<string, string> = {};
      for (const { bodyKey, file } of uploadedEntries) {
        processed[bodyKey] = await compressAndWriteImage(file, folderName, targetDir);
      }
      res.locals.settingsBrandingImages = processed;
      return next();
    } catch (error) {
      console.error('Named image processing error:', error);
      return res.status(500).json({ success: false, message: 'Image processing and upload failed' });
    }
  };
