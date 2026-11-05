import { Router } from 'express';
import { getTermsPageHandler, updateTermsPageHandler } from '../controllers/terms.controller.js';
import { sellerManagementDisabled } from '../middlewares/sellerManagementDisabled.js';
import { validate } from '../middlewares/validate.js';
import { updateTermsPageSchema } from '../validations/terms.validation.js';

const router = Router();

router.get('/', getTermsPageHandler);
router.put('/', sellerManagementDisabled, validate(updateTermsPageSchema), updateTermsPageHandler);

export default router;
