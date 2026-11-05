import { Router } from 'express';
import { getManagedSettingsHandler, getPublicSettingsHandler, sendTelegramTestAlertHandler, updateBrandingHandler, updateSettingsHandler } from '../controllers/settings.controller.js';
import { sellerManagementDisabled } from '../middlewares/sellerManagementDisabled.js';
import { compressAndSaveImageFields, upload } from '../middlewares/uploadMiddleware.js';
import type { NextFunction, Request, Response } from 'express';

const router = Router();
const setSettingsUploadFolder = (req: Request, _res: Response, next: NextFunction) => {
  req.uploadFolder = 'settings';
  next();
};

router.get('/', getPublicSettingsHandler);
router.get('/manage', sellerManagementDisabled, getManagedSettingsHandler);
router.post('/manage/telegram/test', sellerManagementDisabled, sendTelegramTestAlertHandler);
router.patch(
  '/manage/branding',
  sellerManagementDisabled,
  setSettingsUploadFolder,
  upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'favicon', maxCount: 1 }]),
  compressAndSaveImageFields({ logo: 'logoUrl', favicon: 'faviconUrl' }),
  updateBrandingHandler,
);
router.patch('/manage/:section', sellerManagementDisabled, updateSettingsHandler);

export default router;
