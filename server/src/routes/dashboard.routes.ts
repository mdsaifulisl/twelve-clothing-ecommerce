import { Router } from 'express';
import { getDashboardSummaryHandler } from '../controllers/dashboard.controller.js';
import { sellerManagementDisabled } from '../middlewares/sellerManagementDisabled.js';
import { authGuard } from '../middlewares/auth.middleware.js'; 

const router = Router();

router.get('/summary', authGuard(), sellerManagementDisabled, getDashboardSummaryHandler);

export default router;
