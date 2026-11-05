import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  query: string;
  isOpen: boolean;
}

const initialState: SearchState = {
  query: '',
  isOpen: false,
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    toggleSearchModal: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
      if (!action.payload) {
        state.query = ''; // Close হলে সার্চ কুয়েরি ক্লিয়ার হয়ে যাবে
      }
    },
  },
});

export const { setSearchQuery, toggleSearchModal } = searchSlice.actions;
export default searchSlice.reducer;