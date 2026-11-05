import { Router } from 'express';
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

const router = Router();

router.post('/', validate(createOrderSchema), createOrderHandler);
router.post('/lookup', orderLookupRateLimit, validate(orderLookupSchema), lookupOrderHandler);

// These handlers are intentionally fail-closed until server-side seller auth exists.
// Keeping the controllers/services ready does not make these endpoints accessible.
router.get('/', sellerManagementDisabled, validateOrdersQuery, listOrdersHandler);
router.get('/:id', sellerManagementDisabled, getOrderByIdHandler);
router.patch('/:id/status', sellerManagementDisabled, validate(updateOrderStatusSchema), updateOrderStatusHandler);
router.patch('/:id/archive', sellerManagementDisabled, validate(archiveOrderSchema), archiveOrderHandler);
router.patch('/:id/seen', sellerManagementDisabled, markOrderSeenHandler);

export default router;
