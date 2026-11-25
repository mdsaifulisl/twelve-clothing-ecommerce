import { Router, Request, Response, NextFunction } from 'express';
import {
  blockCustomerHandler,
  blockCustomerDeviceHandler,
  getCustomerByIdHandler,
  listCustomersHandler,
  unblockCustomerHandler,
  unblockCustomerDeviceHandler,
} from '../controllers/customer.controller.js';
import { sellerManagementDisabled } from '../middlewares/sellerManagementDisabled.js';
import { validate } from '../middlewares/validate.js';
import { customerBlockSchema } from '../validations/customer.validation.js';
import { autoActivityLogger } from '../middlewares/activityLogger.middleware.js';
import { authGuard } from '../middlewares/auth.middleware.js'; 

const router = Router();

router.get(
  '/', 
  authGuard(), 
  sellerManagementDisabled, 
  listCustomersHandler
);


router.get(
  '/:id', 
  authGuard(), 
  sellerManagementDisabled, 
  getCustomerByIdHandler
);


router.patch(
  '/:id/block', 
  authGuard(), 
  sellerManagementDisabled, 
  validate(customerBlockSchema), 
  (req: Request, res: Response, next: NextFunction) => {
    const customerIdentifier = req.body?.phone || req.body?.customerNumber || req.params.id;
    return autoActivityLogger('Customers', `Blocked Customer [Mobile: ${customerIdentifier}]`)(req, res, next);
  }, 
  blockCustomerHandler 
); 

router.patch( 
  '/:id/unblock', 
  authGuard(), 
  sellerManagementDisabled, 
  (req: Request, res: Response, next: NextFunction) => {
    const customerIdentifier = req.body?.phone || req.body?.customerNumber || req.params.id;
    return autoActivityLogger('Customers', `Unblocked Customer [Mobile: ${customerIdentifier}]`)(req, res, next);
  }, 
  unblockCustomerHandler
);

router.patch(
  '/devices/:id/block', 
  authGuard(), 
  sellerManagementDisabled, 
  validate(customerBlockSchema), 
  (req: Request, res: Response, next: NextFunction) => {
    const deviceIdentifier = req.params.id || req.body?.deviceId || 'Unknown Device';
    return autoActivityLogger('Customers', `Blocked Customer Device [Device: ${deviceIdentifier}]`)(req, res, next);
  }, 
  blockCustomerDeviceHandler
);


router.patch(
  '/devices/:id/unblock', 
  authGuard(),
  sellerManagementDisabled, 
  (req: Request, res: Response, next: NextFunction) => {
    const deviceIdentifier = req.params.id || req.body?.fingerprintHash || 'Unknown Device';
    return autoActivityLogger('Customers', `Unblocked Customer Device [Device: ${deviceIdentifier}]`)(req, res, next);
  }, 
  unblockCustomerDeviceHandler
);

export default router;