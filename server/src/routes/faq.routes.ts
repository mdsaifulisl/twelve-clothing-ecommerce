import { Router } from 'express';
import { getFaqPageHandler, updateFaqPageHandler } from '../controllers/faq.controller.js';
import { sellerManagementDisabled } from '../middlewares/sellerManagementDisabled.js';
import { validate } from '../middlewares/validate.js';
import { updateFaqPageSchema } from '../validations/faq.validation.js';
import { autoActivityLogger } from '../middlewares/activityLogger.middleware.js'; 
import { authGuard } from '../middlewares/auth.middleware.js'; 
const router = Router();


router.get('/', getFaqPageHandler);

router.put(
  '/', 
  authGuard('admin'),
  sellerManagementDisabled, 
  validate(updateFaqPageSchema), 
  autoActivityLogger('Team', 'Updated FAQ Page'), 
);

export default router;