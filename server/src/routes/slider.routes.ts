import { Router, type NextFunction, type Request, type Response } from 'express';
import { createSliderHandler, deleteSliderHandler, listSlidersHandler, updateSliderHandler } from '../controllers/slider.controller.js';
import { sellerManagementDisabled } from '../middlewares/sellerManagementDisabled.js';
import { validate } from '../middlewares/validate.js';
import { compressAndSaveImages, upload } from '../middlewares/uploadMiddleware.js';
import { createSliderSchema, updateSliderSchema } from '../validations/slider.validation.js';

const router = Router();

const setSliderUploadFolder = (_req: Request, res: Response, next: NextFunction) => {
  _req.uploadFolder = 'slider';
  next();
};

router.get('/', listSlidersHandler);
router.post('/', sellerManagementDisabled, setSliderUploadFolder, upload.array('images', 1), compressAndSaveImages, validate(createSliderSchema), createSliderHandler);
router.patch('/:id', sellerManagementDisabled, setSliderUploadFolder, upload.array('images', 1), compressAndSaveImages, validate(updateSliderSchema), updateSliderHandler);
router.delete('/:id', sellerManagementDisabled, deleteSliderHandler);

export default router;
