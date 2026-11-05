import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createStoreLocation, deleteStoreLocation, getStoreLocationErrorMessage, listStoreLocations } from './storeLocationApi';
import type { CreateStoreLocationRequest, StoreLocation, StoreLocationState } from './storeLocationType';

const initialState: StoreLocationState = {
  locations: [],
  isLoading: false,
  isSaving: false,
  error: null,
  requestId: null,
};

export const fetchStoreLocations = createAsyncThunk<StoreLocation[], void, { rejectValue: string }>(
  'storeLocations/fetch',
  async (_, thunkApi) => {
    try {
      const response = await listStoreLocations(thunkApi.signal);
      return response.data;
    } catch (error) {
      if (thunkApi.signal.aborted) throw error;
      return thunkApi.rejectWithValue(getStoreLocationErrorMessage(error, 'Could not load store locations.'));
    }
  },
);

export const addStoreLocation = createAsyncThunk<StoreLocation, CreateStoreLocationRequest, { rejectValue: string }>(
  'storeLocations/create',
  async (payload, thunkApi) => {
    try {
      return await createStoreLocation(payload);
    } catch (error) {
      return thunkApi.rejectWithValue(getStoreLocationErrorMessage(error, 'Could not create this store location.'));
    }
  },
);

export const removeStoreLocation = createAsyncThunk<string, string, { rejectValue: string }>(
  'storeLocations/delete',
  async (id, thunkApi) => {
    try {
      return await deleteStoreLocation(id);
    } catch (error) {
      return thunkApi.rejectWithValue(getStoreLocationErrorMessage(error, 'Could not delete this store location.'));
    }
  },
);

export const storeLocationSlice = createSlice({
  name: 'storeLocations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreLocations.pending, (state, action) => {
        state.requestId = action.meta.requestId;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStoreLocations.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.requestId = null;
        state.isLoading = false;
        state.locations = action.payload;
      })
      .addCase(fetchStoreLocations.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.requestId = null;
        state.isLoading = false;
        if (!action.meta.aborted) state.error = action.payload ?? 'Could not load store locations.';
      })
      .addCase(addStoreLocation.pending, (state) => { state.isSaving = true; state.error = null; })
      .addCase(addStoreLocation.fulfilled, (state, action) => {
        state.isSaving = false;
        state.locations = [...state.locations, action.payload].sort((a, b) =>
          a.division.localeCompare(b.division) || a.name.localeCompare(b.name),
        );
      })
      .addCase(addStoreLocation.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload ?? 'Could not create this store location.';
      })
      .addCase(removeStoreLocation.pending, (state) => { state.isSaving = true; state.error = null; })
      .addCase(removeStoreLocation.fulfilled, (state, action) => {
        state.isSaving = false;
        state.locations = state.locations.filter((location) => location.id !== action.payload);
      })
      .addCase(removeStoreLocation.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload ?? 'Could not delete this store location.';
      });
  },
});

export default storeLocationSlice.reducer;
