import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  loginUser,
  // registerUser,
  logoutUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
  changePassword as changePasswordThunk,
  fetchUserProfile,
  resetAuthState,
} from './authSlice';
import type {
  LoginCredentials,
  ForgotPasswordData,
  VerifyOtpData,
  ResetPasswordData,
  ChangePasswordData,
} from './authTypes';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error, success, message } = useAppSelector(
    (state) => state.auth
  );

  const login = async (credentials: LoginCredentials) => {
    return await dispatch(loginUser(credentials)).unwrap();
  };

  const logout = async () => {
    return await dispatch(logoutUser()).unwrap();
  };

  const requestOtp = async (payload: ForgotPasswordData) => {
    return await dispatch(forgotPassword(payload)).unwrap();
  };

  const verifyUserOtp = async (payload: VerifyOtpData) => {
    return await dispatch(verifyOtp(payload)).unwrap();
  };

  const resetUserPassword = async (payload: ResetPasswordData) => {
    return await dispatch(resetPassword(payload)).unwrap();
  };

  const changePassword = async (payload: ChangePasswordData) => {
    return await dispatch(changePasswordThunk(payload)).unwrap();
  };


  const getProfile = () => {
  return dispatch(fetchUserProfile()).unwrap();
};

  const resetState = () => {
    dispatch(resetAuthState());
  };

  // 🟢 রোল ভিত্তিক হেল্পার প্রপার্টিসমূহ
  const userRole = user?.role?.toLowerCase() || '';
  
  const isAdmin = userRole === 'admin';
  const isModerator = userRole === 'moderator';
  const isEditor = userRole === 'editor';
  const isSupport = userRole === 'support';

  // ডাইনামিক রোল চেকিং ফাংশন (একাধিক রোল চেক করার জন্য)
  const hasRole = (allowedRoles: string[]) => {
    return userRole ? allowedRoles.map(r => r.toLowerCase()).includes(userRole) : false;
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    success,
    message,
    login,
    logout,
    requestOtp,
    verifyUserOtp,
    resetUserPassword,
    changePassword,    
    getProfile,
    resetState,
    // 🟢 নতুন যুক্ত করা হলো
    isAdmin,
    isModerator,
    isEditor,
    isSupport,
    hasRole,
  };
};