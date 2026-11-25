






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
import { autoActivityLogger } from '../middlewares/activityLogger.middleware.js';
import { authGuard } from '../middlewares/auth.middleware.js'; 

const router = Router();

const setProductFolder = (req: Request, res: Response, next: NextFunction) => {
  req.uploadFolder = 'product';
  next();
};

// পাবলিক গেট রুটগুলো
router.get('/', getProductsHandler);
router.get('/:id', getProductByIdHandler);

// নতুন প্রোডাক্ট যোগ করার রাউট (স্কু বা নাম সহ ডাইনামিক লগ)
router.post(
  '/',
  authGuard(),
  setProductFolder,          
  upload.array('images', 5), 
  validate(createProductSchema), 
  compressAndSaveImages,
  (req: Request, res: Response, next: NextFunction) => {
    const productSku = req.body?.sku || 'New SKU';
    const productName = req.body?.name || 'Product';
    return autoActivityLogger('Products', `Added New Product [SKU: ${productSku}]`)(req, res, next);
  }, 
  createProductHandler       
);


router.patch(
  '/:id',
  authGuard(),
  setProductFolder,
  upload.array('images', 5),
  
  validate(updateProductSchema),
  compressAndSaveImages,
  (req: Request, res: Response, next: NextFunction) => {
    const productSku = req.body?.sku || `ID: ${req.params.id}`;
    return autoActivityLogger('Products', `Updated Product [SKU: ${productSku}]`)(req, res, next);
  }, 
  updateProductHandler
);

// প্রোডাক্ট ডিলিট করার রাউট
router.delete(
  '/:id',
  authGuard(),
  (req: Request, res: Response, next: NextFunction) =>
    autoActivityLogger('Products', `Deleted Product (ID: ${req.params.id || 'Unknown'})`)(req, res, next),
  deleteProductHandler
);

export default router;