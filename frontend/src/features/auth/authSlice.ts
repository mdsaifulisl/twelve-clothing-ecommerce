/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type {
  AuthState,
  User,
  LoginCredentials,
  ForgotPasswordData,
  VerifyOtpData,
  ResetPasswordData,
  ChangePasswordData, // 🟢 ইমপোর্ট করুন
} from './authTypes';
import {
  loginAPI,
  logoutAPI,
  forgotPasswordAPI,
  verifyOtpAPI,
  resetPasswordAPI,
  verifyTokenAPI,
  changePasswordAPI, // 🟢 ইমপোর্ট করুন
} from './authApi';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  success: false,
  message: null,
};

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, thunkAPI) => {
    try {
      const data = await loginAPI(credentials);
      return data.data; // User object
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, thunkAPI) => {
    try {
      const data = await logoutAPI();
      return data.message;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (payload: ForgotPasswordData, thunkAPI) => {
    try {
      const data = await forgotPasswordAPI(payload);
      return data.message;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (payload: VerifyOtpData, thunkAPI) => {
    try {
      const data = await verifyOtpAPI(payload);
      return data.message;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'OTP verification failed');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (payload: ResetPasswordData, thunkAPI) => {
    try {
      const data = await resetPasswordAPI(payload);
      return data.message;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Password reset failed');
    }
  }
);

// 🟢 লগইন থাকা অবস্থায় পাসওয়ার্ড পরিবর্তনের Thunk
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (payload: ChangePasswordData, thunkAPI) => {
    try {
      const data = await changePasswordAPI(payload);
      return data.message;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to change password');
    }
  }
);

// Fetch Profile / Verify Token
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, thunkAPI) => {
    try {
      const data = await verifyTokenAPI();
      return data.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.success = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.success = true;
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.success = true;
        state.message = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.success = true;
        state.message = action.payload;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.success = true;
        state.message = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // 🟢 Change Password (SecuritySettings)
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(changePassword.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.success = true;
        state.message = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch Profile / Verify Token
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
