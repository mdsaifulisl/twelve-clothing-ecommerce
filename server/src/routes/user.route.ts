import { Router } from 'express';
import {
  createUserHandler,
  getUsersHandler,
  getUserByIdHandler,
  updateUserHandler,
  deleteUserHandler,
} from '../controllers/user.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  createUserSchema,
  updateUserSchema,
} from '../validations/user.validation.js'; 
import { autoActivityLogger } from '../middlewares/activityLogger.middleware.js'; 
import { authGuard } from '../middlewares/auth.middleware.js';
const router = Router();

router.get('/', authGuard('admin'), getUsersHandler);
router.get('/:id', authGuard('admin'), getUserByIdHandler);

router.post(
  '/',
  authGuard('admin'),
  validate(createUserSchema), 
  autoActivityLogger('Team', 'Created New User'), 
  createUserHandler
);

router.patch(
  '/:id',
  authGuard('admin'),
  validate(updateUserSchema), 
  autoActivityLogger('Team', 'Updated User'), 
  updateUserHandler
);

router.delete('/:id', authGuard('admin'), autoActivityLogger('Team', 'Deleted User'), deleteUserHandler );

export default router;