import { Router } from 'express';
import { 
  getManagedSettingsHandler, 
  getPublicSettingsHandler, 
  sendTelegramTestAlertHandler, 
  updateBrandingHandler, 
  updateSettingsHandler 
} from '../controllers/settings.controller.js';
import { sellerManagementDisabled } from '../middlewares/sellerManagementDisabled.js';
import { compressAndSaveImageFields, upload } from '../middlewares/uploadMiddleware.js';
import type { NextFunction, Request, Response } from 'express';
import { autoActivityLogger } from '../middlewares/activityLogger.middleware.js'; 
import { authGuard } from '../middlewares/auth.middleware.js';

const router = Router();

const setSettingsUploadFolder = (req: Request, _res: Response, next: NextFunction) => {
  req.uploadFolder = 'settings';
  next();
};

// ==========================================
// 🌐  public
// ==========================================
router.get('/', getPublicSettingsHandler);

// ==========================================
// 🔒 private
// ==========================================


router.get(
  '/manage', 
  authGuard(), 
  sellerManagementDisabled,  
  getManagedSettingsHandler
);


router.post(
  '/manage/telegram/test', 
  authGuard('admin'), 
  sellerManagementDisabled, 
  autoActivityLogger('Team', 'Sent Telegram Test Alert'), 
  sendTelegramTestAlertHandler
);


router.patch(
  '/manage/branding',
  authGuard('admin'), 
  sellerManagementDisabled,
  setSettingsUploadFolder,
  upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'favicon', maxCount: 1 }]),
  compressAndSaveImageFields({ logo: 'logoUrl', favicon: 'faviconUrl' }),
  autoActivityLogger('Team', 'Updated Platform Branding'), 
  updateBrandingHandler,
);


router.patch(
  '/manage/:section', 
  authGuard('admin'), 
  sellerManagementDisabled, 
  autoActivityLogger('Team', 'Updated System Settings'), 
  updateSettingsHandler
);

export default router;