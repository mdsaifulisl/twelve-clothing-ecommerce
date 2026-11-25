import { Router } from 'express';
import {
  verifyTokenHandler,
  loginHandler,
  logoutHandler,
  forgotPasswordHandler,
  verifyOtpHandler,
  resetPasswordHandler,
  changePasswordHandler, // 🟢 ইমপোর্ট করুন
} from '../controllers/auth.controller.js';
import { authGuard } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', loginHandler);
router.post('/logout', logoutHandler);
router.post('/forgot-password', forgotPasswordHandler);
router.post('/verify-otp', verifyOtpHandler);
router.post('/reset-password', resetPasswordHandler);

// Protected Routes
router.get('/verify-token', authGuard(), verifyTokenHandler);
router.patch('/change-password', authGuard(), changePasswordHandler); 

export default router;