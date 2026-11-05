import { Router } from 'express';
import {
  createStoreLocationHandler,
  deleteStoreLocationHandler,
  listStoreLocationsHandler,
} from '../controllers/storeLocation.controller.js';
import { sellerManagementDisabled } from '../middlewares/sellerManagementDisabled.js';
import { validate } from '../middlewares/validate.js';
import { createStoreLocationSchema } from '../validations/storeLocation.validation.js';

const router = Router();

router.get('/', listStoreLocationsHandler);
router.post('/', sellerManagementDisabled, validate(createStoreLocationSchema), createStoreLocationHandler);
router.delete('/:id', sellerManagementDisabled, deleteStoreLocationHandler);

export default router;
