import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchAboutSection, getAboutSectionErrorMessage, saveAboutSection } from './aboutSectionApi';
import type { AboutSection, AboutSectionState, UpdateAboutSectionRequest } from './aboutSectionType';
import { DEFAULT_ABOUT_SECTION } from './aboutSectionType';

const initialState: AboutSectionState = {
  content: DEFAULT_ABOUT_SECTION,
  isLoading: false,
  isSaving: false,
  error: null,
  requestId: null,
};

export const loadAboutSection = createAsyncThunk<AboutSection, void, { rejectValue: string }>(
  'aboutSection/fetch',
  async (_, thunkApi) => {
    try {
      return await fetchAboutSection(thunkApi.signal);
    } catch (error) {
      if (thunkApi.signal.aborted) throw error;
      return thunkApi.rejectWithValue(getAboutSectionErrorMessage(error, 'Could not load About content.'));
    }
  },
);

export const updateAboutContent = createAsyncThunk<AboutSection, UpdateAboutSectionRequest, { rejectValue: string }>(
  'aboutSection/update',
  async (payload, thunkApi) => {
    try {
      return await saveAboutSection(payload);
    } catch (error) {
      return thunkApi.rejectWithValue(getAboutSectionErrorMessage(error, 'Could not save About content.'));
    }
  },
);

export const aboutSectionSlice = createSlice({
  name: 'aboutSection',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAboutSection.pending, (state, action) => {
        state.requestId = action.meta.requestId;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadAboutSection.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.requestId = null;
        state.isLoading = false;
        state.content = action.payload;
      })
      .addCase(loadAboutSection.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.requestId = null;
        state.isLoading = false;
        if (!action.meta.aborted) state.error = action.payload ?? 'Could not load About content.';
      })
      .addCase(updateAboutContent.pending, (state) => { state.isSaving = true; state.error = null; })
      .addCase(updateAboutContent.fulfilled, (state, action) => {
        state.isSaving = false;
        state.content = action.payload;
      })
      .addCase(updateAboutContent.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload ?? 'Could not save About content.';
      });
  },
});

export default aboutSectionSlice.reducer;
