import { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';

// টোকেন বা সেশন ভেরিফাই করার হ্যান্ডলার
export const verifyTokenHandler = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Token is valid',
      user: req.user,
    });
  } catch (error: any) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const { user, token } = await authService.login(req.body);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: process.env.NODE_ENV === 'production' ? ('none' as const) : ('lax' as const),
      maxAge: 7 * 24 * 60 * 60 * 1000, // ৭ days
    };

    return res
      .cookie('accessToken', token, cookieOptions)
      .status(200)
      .json({
        success: true,
        message: 'Logged in successfully.',
        data: user,
      });
  } catch (error: any) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

export const logoutHandler = async (_req: Request, res: Response) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: process.env.NODE_ENV === 'production' ? ('none' as const) : ('lax' as const),
    };

    return res
      .clearCookie('accessToken', cookieOptions)
      .status(200)
      .json({ success: true, message: 'Logged out successfully.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPasswordHandler = async (req: Request, res: Response) => {
  try {
    const { emailOrPhone } = req.body;
    const result = await authService.generateOtp(emailOrPhone);
    return res.status(200).json({ success: true, ...result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// 🟢 ১. শুধু ওটিপি ভেরিফাই করার হ্যান্ডলার (Step 3 এর জন্য)
export const verifyOtpHandler = async (req: Request, res: Response) => {
  try {
    const result = await authService.verifyOtpOnly(req.body);
    return res.status(200).json({ success: true, ...result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// 🟢 ২. ওটিপি ভেরিফাই করে পাসওয়ার্ড রিসেট করার হ্যান্ডলার (Step 4 এর জন্য)
export const resetPasswordHandler = async (req: Request, res: Response) => {
  try {
    const result = await authService.resetPassword(req.body);
    return res.status(200).json({ success: true, ...result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// 🟢 ৩. লগইন থাকা অবস্থায় পাসওয়ার্ড পরিবর্তনের হ্যান্ডলার (SecuritySettings এর জন্য)
export const changePasswordHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized user. Please log in again.',
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Both current password and new password are required.',
      });
    }

    const result = await authService.changePassword(userId, {
      currentPassword,
      newPassword,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to change password.',
    });
  }
};