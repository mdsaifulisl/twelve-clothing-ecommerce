import { Router } from 'express';
import {
  getLogsHandler,
  createLogHandler,
  clearLogsHandler,
} from '../controllers/logs.controller.js';
import { validate } from '../middlewares/validate.js'; 
import { createActivityLogSchema } from '../validations/logs.validation.js';
import { authGuard } from '../middlewares/auth.middleware.js'; 
const router = Router();

router.get('/', authGuard('admin'), getLogsHandler);

router.post(
  '/',
  authGuard(),
  validate(createActivityLogSchema),
  createLogHandler
);

router.delete('/', authGuard('admin'), clearLogsHandler);

export default router; 



