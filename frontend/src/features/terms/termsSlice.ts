import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchTermsPage, getTermsErrorMessage, saveTermsPage } from './termsApi';
import type { TermsPageContent, TermsPageState } from './termsType';
import { DEFAULT_TERMS_PAGE } from './termsType';

const initialState: TermsPageState = {
  content: DEFAULT_TERMS_PAGE,
  isLoading: false,
  isSaving: false,
  hasLoaded: false,
  error: null,
  requestId: null,
};

export const loadTermsPage = createAsyncThunk<TermsPageContent, void, { rejectValue: string }>(
  'terms/load', async (_, api) => {
    try { return await fetchTermsPage(api.signal); }
    catch (error) {
      if (api.signal.aborted) throw error;
      return api.rejectWithValue(getTermsErrorMessage(error, 'Could not load Terms & Conditions.'));
    }
  },
);

export const updateTermsPage = createAsyncThunk<TermsPageContent, TermsPageContent, { rejectValue: string }>(
  'terms/update', async (content, api) => {
    try { return await saveTermsPage(content); }
    catch (error) { return api.rejectWithValue(getTermsErrorMessage(error, 'Could not save Terms & Conditions.')); }
  },
);

export const termsSlice = createSlice({
  name: 'terms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadTermsPage.pending, (state, action) => {
        state.requestId = action.meta.requestId;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadTermsPage.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.requestId = null;
        state.isLoading = false;
        state.hasLoaded = true;
        state.content = action.payload;
      })
      .addCase(loadTermsPage.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.requestId = null;
        state.isLoading = false;
        if (!action.meta.aborted) state.error = action.payload ?? 'Could not load Terms & Conditions.';
      })
      .addCase(updateTermsPage.pending, (state) => { state.isSaving = true; state.error = null; })
      .addCase(updateTermsPage.fulfilled, (state, action) => {
        state.isSaving = false;
        state.hasLoaded = true;
        state.content = action.payload;
      })
      .addCase(updateTermsPage.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload ?? 'Could not save Terms & Conditions.';
      });
  },
});

export default termsSlice.reducer;
