import { Router, type NextFunction, type Request, type Response } from 'express';
import { 
  createSliderHandler, 
  deleteSliderHandler, 
  listSlidersHandler, 
  updateSliderHandler 
} from '../controllers/slider.controller.js';
import { sellerManagementDisabled } from '../middlewares/sellerManagementDisabled.js';
import { validate } from '../middlewares/validate.js';
import { compressAndSaveImages, upload } from '../middlewares/uploadMiddleware.js';
import { createSliderSchema, updateSliderSchema } from '../validations/slider.validation.js';
import { autoActivityLogger } from '../middlewares/activityLogger.middleware.js'; 
import { authGuard } from '../middlewares/auth.middleware.js';

const router = Router();

const setSliderUploadFolder = (_req: Request, res: Response, next: NextFunction) => {
  _req.uploadFolder = 'slider';
  next();
};

// ==========================================
// 🌐 Public
// ==========================================

router.get('/', listSlidersHandler);

// ==========================================
// 🔒 Private
// ==========================================

router.post(
  '/', 
  authGuard('admin'), 
  sellerManagementDisabled, 
  setSliderUploadFolder, 
  upload.array('images', 1), 
  compressAndSaveImages, 
  validate(createSliderSchema), 
  autoActivityLogger('Sliders', 'Created New Slider'), 
  createSliderHandler
);

router.patch(
  '/:id', 
  authGuard('admin'), 
  sellerManagementDisabled, 
  setSliderUploadFolder, 
  upload.array('images', 1), 
  compressAndSaveImages, 
  validate(updateSliderSchema), 
  autoActivityLogger('Sliders', 'Updated Slider'), 
  updateSliderHandler
);


router.delete(
  '/:id', 
  authGuard('admin'), 
  sellerManagementDisabled, 
  autoActivityLogger('Sliders', 'Deleted Slider'), 
  deleteSliderHandler
);

export default router;