import axiosInstance from '../../api/axiosInstance';
import type {
  LoginCredentials,
  // RegisterData,
  ForgotPasswordData,
  VerifyOtpData,
  ResetPasswordData,
  ChangePasswordData, // 🟢 authTypes থেকে ইমপোর্ট করুন (অথবা নিচে ইন্টারফেস ডিফাইন করা আছে)
} from './authTypes';

export const loginAPI = async (credentials: LoginCredentials) => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

export const logoutAPI = async () => {
  const response = await axiosInstance.post('/auth/logout');
  return response.data;
};

export const forgotPasswordAPI = async (data: ForgotPasswordData) => {
  const response = await axiosInstance.post('/auth/forgot-password', data);
  return response.data;
};

// ভেরিফাই ওটিপি API
export const verifyOtpAPI = async (data: VerifyOtpData) => {
  const response = await axiosInstance.post('/auth/verify-otp', data);
  return response.data;
};

export const resetPasswordAPI = async (data: ResetPasswordData) => {
  const response = await axiosInstance.post('/auth/reset-password', data);
  return response.data;
};

// পেজ রিফ্রেশ বা সেশন চেক করার জন্য টোকেন ভেরিফিকেশন API 
export const verifyTokenAPI = async () => {
  const response = await axiosInstance.get('/auth/verify-token');
  return response.data;
};

// 🟢 লগইন থাকা অবস্থায় পাসওয়ার্ড পরিবর্তনের API
export const changePasswordAPI = async (data: ChangePasswordData) => {
  const response = await axiosInstance.patch('/auth/change-password', data);
  return response.data;
};