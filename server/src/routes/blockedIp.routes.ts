import { Router } from 'express';
import {
  blockIpHandler,
  listBlockedIpsHandler,
  unblockIpHandler,
} from '../controllers/customer.controller.js';
import { sellerManagementDisabled } from '../middlewares/sellerManagementDisabled.js';
import { validate } from '../middlewares/validate.js';
import { blockIpSchema } from '../validations/customer.validation.js';
import { autoActivityLogger } from '../middlewares/activityLogger.middleware.js';
import { authGuard } from '../middlewares/auth.middleware.js'; 

const router = Router();


router.get(
  '/', 
  authGuard(), 
  sellerManagementDisabled, 
  listBlockedIpsHandler
);


router.post(
  '/', 
  authGuard(), 
  sellerManagementDisabled, 
  validate(blockIpSchema), 
  autoActivityLogger('Customers', 'Blocked IP Address'), 
  blockIpHandler
);

// ৩. আইপি আনব্লক করার রাউট (যদি শুধু Admin করতে দেয়, তবে authGuard(['admin']) দিতে পারেন)
router.patch(
  '/:id/unblock', 
  authGuard(),
  sellerManagementDisabled, 
  autoActivityLogger('Customers', 'Unblocked IP Address'),
  unblockIpHandler
);

export default router;