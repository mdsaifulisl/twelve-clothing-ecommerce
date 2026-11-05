import { Router } from 'express';
import { getFaqPageHandler, updateFaqPageHandler } from '../controllers/faq.controller.js';
import { sellerManagementDisabled } from '../middlewares/sellerManagementDisabled.js';
import { validate } from '../middlewares/validate.js';
import { updateFaqPageSchema } from '../validations/faq.validation.js';

const router = Router();

router.get('/', getFaqPageHandler);
router.put('/', sellerManagementDisabled, validate(updateFaqPageSchema), updateFaqPageHandler);

export default router;
