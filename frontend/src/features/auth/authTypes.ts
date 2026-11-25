export interface User {
  id: string;
  userId?: string; // টোকেন ডিকোড রেসপন্স সাপোর্ট করার জন্য ঐচ্ছিক ফিল্ড
  name: string;
  email: string;
  phone?: string | null;
  role: 'admin' | 'moderator';
  status: 'active' | 'inactive' | 'blocked';
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  emailOrPhone: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'admin' | 'moderator';
}

export interface ForgotPasswordData {
  emailOrPhone: string;
}

export interface VerifyOtpData {
  emailOrPhone: string;
  otp: string;
}

export interface ResetPasswordData {
  emailOrPhone: string;
  otp: string;
  newPassword: string;
}

// 🟢 লগইন থাকা অবস্থায় পাসওয়ার্ড পরিবর্তনের টাইপ
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
}