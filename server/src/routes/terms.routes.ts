import { Router } from 'express';
import { getTermsPageHandler, updateTermsPageHandler } from '../controllers/terms.controller.js';
import { sellerManagementDisabled } from '../middlewares/sellerManagementDisabled.js';
import { validate } from '../middlewares/validate.js';
import { updateTermsPageSchema } from '../validations/terms.validation.js';
import { autoActivityLogger } from '../middlewares/activityLogger.middleware.js'; 
import { authGuard } from '../middlewares/auth.middleware.js';
const router = Router();

router.get('/', getTermsPageHandler);
router.put(
  '/', 
  authGuard('admin'),
  sellerManagementDisabled, 
  validate(updateTermsPageSchema), 
  autoActivityLogger('Team', 'Updated Terms Page'), 
  updateTermsPageHandler
);

export default router;
