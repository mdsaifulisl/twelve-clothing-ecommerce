import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  createOrder,
  getOrderErrorMessage,
  lookupOrder,
  listOrders,
  markOrderSeen,
  setOrderArchived,
  updateOrderStatus,
} from './orderApi';
import type { CreateOrderRequest, OrderListResponse, OrderResponse, OrderState, OrderStatus, SellerOrderQuery } from './orderType';

interface ApiFailure { message: string; status?: number }

const initialState: OrderState = {
  sellerOrders: [],
  sellerOrdersLoading: false,
  sellerOrdersError: null,
  sellerOrderCount: 0,
  sellerOrderTotalPages: 1,
  mutationId: null,
  mutationError: null,
  isCreatingOrder: false,
  createOrderError: null,
  createdOrder: null,
  isLookingUpOrder: false,
  lookupError: null,
  lookupErrorStatus: null,
  trackedOrder: null,
};

const failureFrom = (error: unknown): ApiFailure => ({
  message: getOrderErrorMessage(error, 'The order request failed.'),
  ...(axios.isAxiosError(error) ? { status: error.response?.status ?? 0 } : {}),
});

export const placeOrder = createAsyncThunk<OrderResponse, CreateOrderRequest, { rejectValue: ApiFailure }>(
  'orders/place', async (payload, thunkApi) => {
    try { return await createOrder(payload); }
    catch (error) { return thunkApi.rejectWithValue(failureFrom(error)); }
  },
);

export const findCustomerOrder = createAsyncThunk<OrderResponse, { orderCode: string; phone: string }, { rejectValue: ApiFailure }>(
  'orders/lookup', async (payload, thunkApi) => {
    try { return await lookupOrder(payload.orderCode, payload.phone); }
    catch (error) { return thunkApi.rejectWithValue(failureFrom(error)); }
  },
);

export const fetchSellerOrders = createAsyncThunk<OrderListResponse, SellerOrderQuery, { rejectValue: string }>(
  'orders/list', async (query: SellerOrderQuery, thunkApi) => {
    try { return await listOrders({ ...query, signal: thunkApi.signal }); }
    catch (error) { return thunkApi.rejectWithValue(getOrderErrorMessage(error, 'Could not load orders.')); }
  },
);

export const changeSellerOrderStatus = createAsyncThunk<OrderResponse, { id: string; status: OrderStatus }, { rejectValue: string }>(
  'orders/updateStatus', async ({ id, status }, thunkApi) => {
    try { return await updateOrderStatus(id, status); }
    catch (error) { return thunkApi.rejectWithValue(getOrderErrorMessage(error, 'Could not update order status.')); }
  },
);

export const changeSellerOrderArchive = createAsyncThunk<OrderResponse, { id: string; archived: boolean }, { rejectValue: string }>(
  'orders/archive', async ({ id, archived }, thunkApi) => {
    try { return await setOrderArchived(id, archived); }
    catch (error) { return thunkApi.rejectWithValue(getOrderErrorMessage(error, 'Could not update archive status.')); }
  },
);

export const markSellerOrderSeen = createAsyncThunk<OrderResponse, { id: string }, { rejectValue: string }>(
  'orders/markSeen', async ({ id }, thunkApi) => {
    try { return await markOrderSeen(id); }
    catch (error) { return thunkApi.rejectWithValue(getOrderErrorMessage(error, 'Could not mark this order as seen.')); }
  },
);

const replaceOrder = (state: OrderState, order: OrderResponse) => {
  state.sellerOrders = state.sellerOrders.map((item) => item.id === order.id ? order : item);
};

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCreatedOrder: (state) => { state.createdOrder = null; state.createOrderError = null; },
    clearTrackedOrder: (state) => { state.trackedOrder = null; state.lookupError = null; state.lookupErrorStatus = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => { state.isCreatingOrder = true; state.createOrderError = null; state.createdOrder = null; })
      .addCase(placeOrder.fulfilled, (state, action) => { state.isCreatingOrder = false; state.createdOrder = action.payload; })
      .addCase(placeOrder.rejected, (state, action) => { state.isCreatingOrder = false; state.createOrderError = action.payload?.message ?? action.error.message ?? 'Could not place order.'; })
      .addCase(findCustomerOrder.pending, (state) => { state.isLookingUpOrder = true; state.lookupError = null; state.lookupErrorStatus = null; state.trackedOrder = null; })
      .addCase(findCustomerOrder.fulfilled, (state, action) => { state.isLookingUpOrder = false; state.trackedOrder = action.payload; })
      .addCase(findCustomerOrder.rejected, (state, action) => {
        state.isLookingUpOrder = false;
        state.lookupError = action.payload?.message ?? action.error.message ?? 'Could not look up this order.';
        state.lookupErrorStatus = action.payload?.status ?? null;
      })
      .addCase(fetchSellerOrders.pending, (state) => { state.sellerOrdersLoading = true; state.sellerOrdersError = null; })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.sellerOrdersLoading = false;
        state.sellerOrders = action.payload.data;
        state.sellerOrderCount = action.payload.count;
        state.sellerOrderTotalPages = action.payload.pagination.totalPages;
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.sellerOrdersLoading = false;
        if (!action.meta.aborted) state.sellerOrdersError = action.payload ?? 'Could not load orders.';
      })
      .addCase(changeSellerOrderStatus.pending, (state, action) => { state.mutationId = action.meta.arg.id; state.mutationError = null; })
      .addCase(changeSellerOrderStatus.fulfilled, (state, action) => { replaceOrder(state, action.payload); state.mutationId = null; state.mutationError = null; })
      .addCase(changeSellerOrderStatus.rejected, (state, action) => { state.mutationId = null; state.mutationError = action.payload ?? 'Could not update order status.'; })
      .addCase(changeSellerOrderArchive.pending, (state, action) => { state.mutationId = action.meta.arg.id; state.mutationError = null; })
      .addCase(changeSellerOrderArchive.fulfilled, (state, action) => { replaceOrder(state, action.payload); state.mutationId = null; state.mutationError = null; })
      .addCase(changeSellerOrderArchive.rejected, (state, action) => { state.mutationId = null; state.mutationError = action.payload ?? 'Could not update archive status.'; })
      .addCase(markSellerOrderSeen.pending, (state, action) => { state.mutationId = action.meta.arg.id; state.mutationError = null; })
      .addCase(markSellerOrderSeen.fulfilled, (state, action) => { replaceOrder(state, action.payload); state.mutationId = null; state.mutationError = null; })
      .addCase(markSellerOrderSeen.rejected, (state, action) => { state.mutationId = null; state.mutationError = action.payload ?? 'Could not mark order as seen.'; });
  },
});

export const { clearCreatedOrder, clearTrackedOrder } = orderSlice.actions;
export default orderSlice.reducer;
