import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type AlertType = 'success' | 'error' | 'info';

interface AlertState {
  isOpen: boolean;
  message: string;
  type: AlertType;
  title?: string;
  isToast?: boolean; // নতুন প্রপার্টি: এটি নরমাল মডাল নাকি টোস্ট নোটিফিকেশন তা বোঝার জন্য
}

const initialState: AlertState = {
  isOpen: false,
  message: '',
  type: 'info',
  title: '',
  isToast: false,
};

export const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    showAlertModal: (
      state,
      action: PayloadAction<{ message: string; type?: AlertType; title?: string; isToast?: boolean }>
    ) => {
      state.isOpen = true;
      state.message = action.payload.message;
      state.type = action.payload.type || 'info';
      state.title = action.payload.title;
      state.isToast = action.payload.isToast || false;
    },
    hideAlertModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { showAlertModal, hideAlertModal } = alertSlice.actions;
export default alertSlice.reducer;