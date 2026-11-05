import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createBlockedIp,
  getCustomerErrorMessage,
  listBlockedIps,
  listCustomers,
  setCustomerBlocked,
  setCustomerDeviceBlocked as setCustomerDeviceBlockedRequest,
  unblockIp,
} from './customerApi';
import type { BlockedIpRecord, CustomerDeviceRecord, CustomerManagementState, CustomerRecord } from './customerType';

const initialState: CustomerManagementState = {
  customers: [],
  blockedIps: [],
  isLoading: false,
  error: null,
  mutationId: null,
  fetchRequestId: null,
};

export const fetchCustomerManagement = createAsyncThunk<
  { customers: CustomerRecord[]; blockedIps: BlockedIpRecord[] },
  { search?: string } | undefined,
  { rejectValue: string }
>('customerManagement/fetch', async (params, thunkApi) => {
  try {
    const [customerResult, ipResult] = await Promise.all([
      listCustomers({ search: params?.search, blocked: 'all', limit: 100, signal: thunkApi.signal }),
      listBlockedIps({ status: 'all', limit: 100, signal: thunkApi.signal }),
    ]);
    return { customers: customerResult.data, blockedIps: ipResult.data };
  } catch (error) {
    if (thunkApi.signal.aborted) throw error;
    return thunkApi.rejectWithValue(getCustomerErrorMessage(error, 'Could not load customer management data.'));
  }
});

export const blockCustomer = createAsyncThunk<CustomerRecord, { id: string }, { rejectValue: string }>(
  'customerManagement/blockCustomer',
  async ({ id }, thunkApi) => {
    try {
      return await setCustomerBlocked(id, true);
    } catch (error) {
      return thunkApi.rejectWithValue(getCustomerErrorMessage(error, 'Could not block this customer.'));
    }
  },
);

export const unblockCustomer = createAsyncThunk<CustomerRecord, { id: string }, { rejectValue: string }>(
  'customerManagement/unblockCustomer',
  async ({ id }, thunkApi) => {
    try {
      return await setCustomerBlocked(id, false);
    } catch (error) {
      return thunkApi.rejectWithValue(getCustomerErrorMessage(error, 'Could not unblock this customer.'));
    }
  },
);

export const changeCustomerDeviceBlock = createAsyncThunk<CustomerDeviceRecord, { id: string; blocked: boolean }, { rejectValue: string }>(
  'customerManagement/deviceBlock', async ({ id, blocked }, thunkApi) => {
    try { return await setCustomerDeviceBlockedRequest(id, blocked); }
    catch (error) { return thunkApi.rejectWithValue(getCustomerErrorMessage(error, 'Could not update device block status.')); }
  },
);

export const blockIpAddress = createAsyncThunk<BlockedIpRecord, { ipAddress: string }, { rejectValue: string }>(
  'customerManagement/blockIp',
  async ({ ipAddress }, thunkApi) => {
    try {
      return await createBlockedIp(ipAddress);
    } catch (error) {
      return thunkApi.rejectWithValue(getCustomerErrorMessage(error, 'Could not block this IP address.'));
    }
  },
);

export const unblockIpAddress = createAsyncThunk<BlockedIpRecord, { id: string }, { rejectValue: string }>(
  'customerManagement/unblockIp',
  async ({ id }, thunkApi) => {
    try {
      return await unblockIp(id);
    } catch (error) {
      return thunkApi.rejectWithValue(getCustomerErrorMessage(error, 'Could not unblock this IP address.'));
    }
  },
);

const replaceCustomer = (state: CustomerManagementState, customer: CustomerRecord) => {
  state.customers = state.customers.map((item) => item.id === customer.id ? {
    ...item,
    ...customer,
    devices: customer.devices ?? item.devices ?? [],
    totalOrders: customer.totalOrders ?? item.totalOrders,
    totalOrderValue: customer.totalOrderValue ?? item.totalOrderValue,
    lastOrderDate: customer.lastOrderDate ?? item.lastOrderDate,
    address: customer.address ?? item.address,
    city: customer.city ?? item.city,
    ipAddress: customer.ipAddress ?? item.ipAddress,
    isIpBlocked: customer.isIpBlocked ?? item.isIpBlocked,
  } : item);
};

export const customerManagementSlice = createSlice({
  name: 'customerManagement',
  initialState,
  reducers: {
    clearCustomerManagementError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerManagement.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        state.fetchRequestId = action.meta.requestId;
      })
      .addCase(fetchCustomerManagement.fulfilled, (state, action) => {
        if (state.fetchRequestId !== action.meta.requestId) return;
        state.isLoading = false;
        state.fetchRequestId = null;
        state.customers = action.payload.customers;
        state.blockedIps = action.payload.blockedIps;
      })
      .addCase(fetchCustomerManagement.rejected, (state, action) => {
        if (state.fetchRequestId !== action.meta.requestId) return;
        state.isLoading = false;
        state.fetchRequestId = null;
        if (action.meta.aborted) return;
        state.error = action.payload ?? 'Could not load customer management data.';
      })
      .addCase(blockCustomer.pending, (state, action) => { state.mutationId = action.meta.arg.id; state.error = null; })
      .addCase(blockCustomer.fulfilled, (state, action) => { state.mutationId = null; replaceCustomer(state, action.payload); })
      .addCase(blockCustomer.rejected, (state, action) => { state.mutationId = null; state.error = action.payload ?? 'Could not block this customer.'; })
      .addCase(unblockCustomer.pending, (state, action) => { state.mutationId = action.meta.arg.id; state.error = null; })
      .addCase(unblockCustomer.fulfilled, (state, action) => { state.mutationId = null; replaceCustomer(state, action.payload); })
      .addCase(unblockCustomer.rejected, (state, action) => { state.mutationId = null; state.error = action.payload ?? 'Could not unblock this customer.'; })
      .addCase(changeCustomerDeviceBlock.pending, (state, action) => { state.mutationId = action.meta.arg.id; state.error = null; })
      .addCase(changeCustomerDeviceBlock.fulfilled, (state, action) => {
        state.mutationId = null;
        state.customers = state.customers.map((customer) => ({
          ...customer,
          devices: customer.devices.map((device) => device.id === action.payload.id ? { ...device, isBlocked: action.payload.isBlocked } : device),
        }));
      })
      .addCase(changeCustomerDeviceBlock.rejected, (state, action) => { state.mutationId = null; state.error = action.payload ?? 'Could not update device block status.'; })
      .addCase(blockIpAddress.pending, (state, action) => { state.mutationId = action.meta.arg.ipAddress; state.error = null; })
      .addCase(blockIpAddress.fulfilled, (state, action) => {
        state.mutationId = null;
        state.blockedIps = [action.payload, ...state.blockedIps.filter((item) => item.id !== action.payload.id)];
        state.customers = state.customers.map((customer) => customer.ipAddress === action.payload.address ? { ...customer, isIpBlocked: true } : customer);
      })
      .addCase(blockIpAddress.rejected, (state, action) => { state.mutationId = null; state.error = action.payload ?? 'Could not block this IP address.'; })
      .addCase(unblockIpAddress.pending, (state, action) => { state.mutationId = action.meta.arg.id; state.error = null; })
      .addCase(unblockIpAddress.fulfilled, (state, action) => {
        state.mutationId = null;
        state.blockedIps = state.blockedIps.map((item) => item.id === action.payload.id ? action.payload : item);
        state.customers = state.customers.map((customer) => customer.ipAddress === action.payload.address ? { ...customer, isIpBlocked: false } : customer);
      })
      .addCase(unblockIpAddress.rejected, (state, action) => { state.mutationId = null; state.error = action.payload ?? 'Could not unblock this IP address.'; });
  },
});

export const { clearCustomerManagementError } = customerManagementSlice.actions;
export default customerManagementSlice.reducer;
