import { Router, Request, Response, NextFunction } from 'express';
import {
  createProductHandler,
  getProductsHandler,
  getProductByIdHandler,
  updateProductHandler,
  deleteProductHandler,
} from '../controllers/product.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  createProductSchema,
  updateProductSchema,
} from '../validations/product.validation.js';
import { upload, compressAndSaveImages } from '../middlewares/uploadMiddleware.js'; 

const router = Router();

const setProductFolder = (req: Request, res: Response, next: NextFunction) => {
  req.uploadFolder = 'product';
  next();
};

router.get('/', getProductsHandler);
router.get('/:id', getProductByIdHandler);

router.post(
  '/',
  setProductFolder,          
  upload.array('images', 5), 
  validate(createProductSchema), 
  compressAndSaveImages,     
  createProductHandler       
);

router.patch(
  '/:id',
  setProductFolder,
  upload.array('images', 5),
  validate(updateProductSchema),
  compressAndSaveImages,
  updateProductHandler
);

router.delete(
  '/:id',
  deleteProductHandler
);

export default router;