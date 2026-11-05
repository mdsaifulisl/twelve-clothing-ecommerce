import { Router } from 'express';
import { getDashboardSummaryHandler } from '../controllers/dashboard.controller.js';
import { sellerManagementDisabled } from '../middlewares/sellerManagementDisabled.js';

const router = Router();

router.get('/summary', sellerManagementDisabled, getDashboardSummaryHandler);

export default router;
