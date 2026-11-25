import { Router } from 'express';
import {
  createStoreLocationHandler,
  deleteStoreLocationHandler,
  listStoreLocationsHandler,
} from '../controllers/storeLocation.controller.js';
import { sellerManagementDisabled } from '../middlewares/sellerManagementDisabled.js';
import { validate } from '../middlewares/validate.js';
import { createStoreLocationSchema } from '../validations/storeLocation.validation.js';
import { autoActivityLogger } from '../middlewares/activityLogger.middleware.js'; 
import { authGuard } from '../middlewares/auth.middleware.js';

const router = Router();


router.get('/', listStoreLocationsHandler);

// নতুন স্টোর লোকেশন তৈরি (অটো লগ রেকর্ড করবে)
router.post(
  '/', 
  authGuard('admin'),
  sellerManagementDisabled, 
  validate(createStoreLocationSchema), 
  autoActivityLogger('Team', 'Created New Store Location'), 
  createStoreLocationHandler
);

// স্টোর লোকেশন ডিলিট করা (অটো লগ রেকর্ড করবে)
router.delete(
  '/:id',
  authGuard('admin'), 
  sellerManagementDisabled, 
  autoActivityLogger('Team', 'Deleted Store Location'), 
  deleteStoreLocationHandler
);

export default router;