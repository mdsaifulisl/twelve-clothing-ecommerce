import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createSlider, deleteSlider, getSliderErrorMessage, listSliders, updateSlider } from './sliderApi';
import type { BannerSlide, SaveSliderPayload, SliderState } from './sliderType';

const initialState: SliderState = {
  slides: [],
  isLoading: false,
  isSaving: false,
  error: null,
  requestId: null,
};

export const fetchSliders = createAsyncThunk<BannerSlide[], void, { rejectValue: string }>(
  'sliders/fetch',
  async (_, thunkApi) => {
    try {
      const response = await listSliders(thunkApi.signal);
      return response.data;
    } catch (error) {
      if (thunkApi.signal.aborted) throw error;
      return thunkApi.rejectWithValue(getSliderErrorMessage(error, 'Could not load sliders.'));
    }
  },
);

export const saveSlider = createAsyncThunk<BannerSlide, SaveSliderPayload, { rejectValue: string }>(
  'sliders/save',
  async ({ id, formData }, thunkApi) => {
    try {
      return id ? await updateSlider(id, formData) : await createSlider(formData);
    } catch (error) {
      return thunkApi.rejectWithValue(getSliderErrorMessage(error, 'Could not save slider.'));
    }
  },
);

export const removeSlider = createAsyncThunk<string, string, { rejectValue: string }>(
  'sliders/delete',
  async (id, thunkApi) => {
    try {
      return await deleteSlider(id);
    } catch (error) {
      return thunkApi.rejectWithValue(getSliderErrorMessage(error, 'Could not delete slider.'));
    }
  },
);

export const sliderSlice = createSlice({
  name: 'sliders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSliders.pending, (state, action) => {
        state.requestId = action.meta.requestId;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSliders.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.requestId = null;
        state.isLoading = false;
        state.slides = action.payload;
      })
      .addCase(fetchSliders.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.requestId = null;
        state.isLoading = false;
        if (!action.meta.aborted) state.error = action.payload ?? 'Could not load sliders.';
      })
      .addCase(saveSlider.pending, (state) => { state.isSaving = true; state.error = null; })
      .addCase(saveSlider.fulfilled, (state, action) => {
        state.isSaving = false;
        const index = state.slides.findIndex((slide) => slide.id === action.payload.id);
        if (index < 0) state.slides.push(action.payload);
        else state.slides[index] = action.payload;
      })
      .addCase(saveSlider.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload ?? 'Could not save slider.';
      })
      .addCase(removeSlider.pending, (state) => { state.isSaving = true; state.error = null; })
      .addCase(removeSlider.fulfilled, (state, action) => {
        state.isSaving = false;
        state.slides = state.slides.filter((slide) => slide.id !== action.payload);
      })
      .addCase(removeSlider.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload ?? 'Could not delete slider.';
      });
  },
});

export default sliderSlice.reducer;
