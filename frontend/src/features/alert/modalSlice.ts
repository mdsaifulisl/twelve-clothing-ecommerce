/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: (() => void) | null;
}

const initialState: ModalState = {
  isOpen: false,
  title: 'Are you sure?',
  message: '',
  onConfirm: null,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{ title?: string; message: string; onConfirm: () => void }>
    ) => {
      state.isOpen = true;
      state.title = action.payload.title || 'Are you sure?';
      state.message = action.payload.message;
      state.onConfirm = action.payload.onConfirm;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.onConfirm = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;