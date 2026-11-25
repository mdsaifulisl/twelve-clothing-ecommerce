import { Router, type NextFunction, type Request, type Response } from 'express';
import { getAboutSectionHandler, updateAboutSectionHandler } from '../controllers/aboutSection.controller.js';
import { sellerManagementDisabled } from '../middlewares/sellerManagementDisabled.js';
import { validate } from '../middlewares/validate.js';
import { compressAndSaveImages, upload } from '../middlewares/uploadMiddleware.js';
import { updateAboutSectionSchema } from '../validations/aboutSection.validation.js';
import { autoActivityLogger } from '../middlewares/activityLogger.middleware.js';
import { authGuard } from '../middlewares/auth.middleware.js';

const router = Router();

const setAboutUploadFolder = (req: Request, _res: Response, next: NextFunction) => {
  req.uploadFolder = 'about';
  next();
};

// 🟢 পাবলিক গেট রাউট
router.get('/', getAboutSectionHandler);


router.put(
  '/', 
  authGuard('admin'),
  sellerManagementDisabled, 
  setAboutUploadFolder, 
  upload.array('images', 1), 
  compressAndSaveImages, 
  validate(updateAboutSectionSchema), 
  autoActivityLogger('Team', 'Updated About Section'),
  updateAboutSectionHandler
);

export default router;