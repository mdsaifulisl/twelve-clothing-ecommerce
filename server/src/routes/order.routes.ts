import { Router, Request, Response, NextFunction } from 'express';
import {
  archiveOrderHandler,
  createOrderHandler,
  getOrderByIdHandler,
  listOrdersHandler,
  lookupOrderHandler,
  markOrderSeenHandler,
  updateOrderStatusHandler,
  validateOrdersQuery,
} from '../controllers/order.controller.js';
import { validate } from '../middlewares/validate.js';
import { orderLookupRateLimit } from '../middlewares/orderLookupRateLimit.js';
import { sellerManagementDisabled } from '../middlewares/sellerManagementDisabled.js';
import {
  archiveOrderSchema,
  createOrderSchema,
  orderLookupSchema,
  updateOrderStatusSchema,
} from '../validations/order.validation.js';
import { autoActivityLogger } from '../middlewares/activityLogger.middleware.js'; 
import { authGuard } from '../middlewares/auth.middleware.js'; 

const router = Router();

// ==========================================
// 🌐 public
// ==========================================

router.post(
  '/', 
  validate(createOrderSchema),  
  createOrderHandler
);


router.post('/lookup', orderLookupRateLimit, validate(orderLookupSchema), lookupOrderHandler);

// ==========================================
// 🔒 private 
// ==========================================


router.get(
  '/', 
  authGuard(), 
  sellerManagementDisabled, 
  validateOrdersQuery, 
  listOrdersHandler
);


router.get(
  '/:id', 
  authGuard(),
  sellerManagementDisabled, 
  getOrderByIdHandler
);


router.patch(
  '/:id/status', 
  authGuard(), 
  sellerManagementDisabled, 
  validate(updateOrderStatusSchema), 
  (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id || 'Unknown ID';
    const newStatus = req.body?.status || 'New Status';
    return autoActivityLogger('Orders', `Updated Order [ID: ${orderId}] Status to ${newStatus}`)(req, res, next);
  }, 
  updateOrderStatusHandler
);

router.patch(
  '/:id/archive', 
  authGuard(), 
  sellerManagementDisabled, 
  validate(archiveOrderSchema), 
  (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id || 'Unknown ID';
    const newStatus = req.body?.status || 'Archived';
    return autoActivityLogger('Orders', `Archived Order [ID: ${orderId}] Status to ${newStatus}`)(req, res, next);
  }, 
  archiveOrderHandler
);

router.patch(
  '/:id/seen', 
  authGuard(), 
  // sellerManagementDisabled, 
  (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id || 'Unknown ID';
    return autoActivityLogger('Orders', `Marked Order [ID: ${orderId}] as Seen`)(req, res, next);
  }, 
  markOrderSeenHandler
);

export default router;