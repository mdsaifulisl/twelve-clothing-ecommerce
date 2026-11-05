import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchDashboardSummary, getDashboardErrorMessage } from './dashboardApi';
import type { DashboardPeriod, DashboardState, DashboardSummary } from './dashboardType';

const initialState: DashboardState = { summary: null, period: 'monthly', isLoading: false, error: null, requestId: null };

export const loadDashboardSummary = createAsyncThunk<DashboardSummary, DashboardPeriod, { rejectValue: string }>(
  'dashboard/loadSummary', async (period, api) => {
    try { return await fetchDashboardSummary(period, api.signal); }
    catch (error) {
      if (api.signal.aborted) throw error;
      return api.rejectWithValue(getDashboardErrorMessage(error));
    }
  },
);

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadDashboardSummary.pending, (state, action) => {
        state.requestId = action.meta.requestId;
        state.period = action.meta.arg;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadDashboardSummary.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.requestId = null;
        state.isLoading = false;
        state.summary = action.payload;
      })
      .addCase(loadDashboardSummary.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.requestId = null;
        state.isLoading = false;
        if (!action.meta.aborted) state.error = action.payload ?? 'Could not load dashboard data.';
      });
  },
});

export default dashboardSlice.reducer;
