import { Router } from 'express';
import {
  blockCustomerHandler,
  blockCustomerDeviceHandler,
  getCustomerByIdHandler,
  listCustomersHandler,
  unblockCustomerHandler,
  unblockCustomerDeviceHandler,
} from '../controllers/customer.controller.js';
import { sellerManagementDisabled } from '../middlewares/sellerManagementDisabled.js';
import { validate } from '../middlewares/validate.js';
import { customerBlockSchema } from '../validations/customer.validation.js';

const router = Router();

router.get('/', sellerManagementDisabled, listCustomersHandler);
router.get('/:id', sellerManagementDisabled, getCustomerByIdHandler);
router.patch('/:id/block', sellerManagementDisabled, validate(customerBlockSchema), blockCustomerHandler);
router.patch('/:id/unblock', sellerManagementDisabled, unblockCustomerHandler);
router.patch('/devices/:id/block', sellerManagementDisabled, validate(customerBlockSchema), blockCustomerDeviceHandler);
router.patch('/devices/:id/unblock', sellerManagementDisabled, unblockCustomerDeviceHandler);

export default router;
