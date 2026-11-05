import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchFaqItems, getFaqErrorMessage, saveFaqItems } from './faqApi';
import type { FaqItem, FaqState } from './faqType';
import { DEFAULT_FAQ_ITEMS } from './faqType';

const initialState: FaqState = {
  items: DEFAULT_FAQ_ITEMS,
  isLoading: false,
  isSaving: false,
  hasLoaded: false,
  error: null,
  requestId: null,
};

export const loadFaqItems = createAsyncThunk<FaqItem[], void, { rejectValue: string }>(
  'faq/load', async (_, api) => {
    try { return await fetchFaqItems(api.signal); }
    catch (error) {
      if (api.signal.aborted) throw error;
      return api.rejectWithValue(getFaqErrorMessage(error, 'Could not load FAQ content.'));
    }
  },
);

export const updateFaqItems = createAsyncThunk<FaqItem[], FaqItem[], { rejectValue: string }>(
  'faq/update', async (items, api) => {
    try { return await saveFaqItems(items); }
    catch (error) { return api.rejectWithValue(getFaqErrorMessage(error, 'Could not save FAQ content.')); }
  },
);

export const faqSlice = createSlice({
  name: 'faq',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadFaqItems.pending, (state, action) => {
        state.requestId = action.meta.requestId;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadFaqItems.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.requestId = null;
        state.isLoading = false;
        state.hasLoaded = true;
        state.items = action.payload;
      })
      .addCase(loadFaqItems.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.requestId = null;
        state.isLoading = false;
        if (!action.meta.aborted) state.error = action.payload ?? 'Could not load FAQ content.';
      })
      .addCase(updateFaqItems.pending, (state) => { state.isSaving = true; state.error = null; })
      .addCase(updateFaqItems.fulfilled, (state, action) => {
        state.isSaving = false;
        state.hasLoaded = true;
        state.items = action.payload;
      })
      .addCase(updateFaqItems.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload ?? 'Could not save FAQ content.';
      });
  },
});

export default faqSlice.reducer;
