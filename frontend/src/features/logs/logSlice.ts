/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchLogsAPI, createLogAPI, clearLogsAPI } from './logApi';
import type { LogState, CreateLogPayload } from './logTypes';

const initialState: LogState = {
  logs: [],
  isLoading: false,
  error: null,
  success: false,
};

// Async Thunks
export const getLogs = createAsyncThunk(
  'logs/getLogs',
  async (params: { search?: string; module?: string } | undefined, thunkAPI) => {
    try {
      const data = await fetchLogsAPI(params);
      return data.data; // Backend sendResponse এর data structure অনুযায়ী
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createLog = createAsyncThunk(
  'logs/createLog',
  async (logData: CreateLogPayload, thunkAPI) => {
    try {
      const data = await createLogAPI(logData);
      return data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const clearLogs = createAsyncThunk('logs/clearLogs', async (_, thunkAPI) => {
  try {
    await clearLogsAPI();
    return true;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const logSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    resetLogState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Logs
      .addCase(getLogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.logs = action.payload;
      })
      .addCase(getLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Create Log
      .addCase(createLog.pending, (state) => {
        state.isLoading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createLog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.logs.unshift(action.payload);
      })
      .addCase(createLog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Clear Logs
      .addCase(clearLogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearLogs.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
        state.logs = [];
      })
      .addCase(clearLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetLogState } = logSlice.actions;
export default logSlice.reducer;