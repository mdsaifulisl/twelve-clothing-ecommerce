import { Router } from 'express';
import {
  blockIpHandler,
  listBlockedIpsHandler,
  unblockIpHandler,
} from '../controllers/customer.controller.js';
import { sellerManagementDisabled } from '../middlewares/sellerManagementDisabled.js';
import { validate } from '../middlewares/validate.js';
import { blockIpSchema } from '../validations/customer.validation.js';

const router = Router();

router.get('/', sellerManagementDisabled, listBlockedIpsHandler);
router.post('/', sellerManagementDisabled, validate(blockIpSchema), blockIpHandler);
router.patch('/:id/unblock', sellerManagementDisabled, unblockIpHandler);

export default router;
