/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { IProduct, IProductState } from './ProductType';
import {
  fetchProductsAPI,
  fetchProductByIdAPI,
  createProductAPI,
  updateProductAPI,
  deleteProductAPI,
} from './ProductApi';

const initialState: IProductState = {
  products: [],
  product: null,
  isLoading: false,
  error: null,
  success: false,
};

// 💡 হেল্পার ফাংশন ব্যাকএন্ডের যেকোনো ফরম্যাটের এরর মেসেজ এক্সট্রাক্ট করার জন্য
const extractErrorMessage = (error: any): string => {
  // ১. ব্যাকএন্ডে যদি Zod ভ্যালিডেশন এরর অ্যারে থাকে (যেমন: errors: [{ message: '...' }])
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    return error.response.data.errors.map((err: any) => err.message).join(', ');
  }
  // ২. সাধারণ মেসেজ থাকলে
  return (
    error.response?.data?.message || 
    error.message || 
    'An unexpected error occurred'
  );
};

// Async Thunks
export const getProducts = createAsyncThunk('products/getAll', async (_, thunkAPI) => {
  try {
    const data = await fetchProductsAPI();
    return data.data; 
  } catch (error: any) {
    return thunkAPI.rejectWithValue(extractErrorMessage(error));
  }
});

export const getProductById = createAsyncThunk('products/getById', async (id: string, thunkAPI) => {
  try {
    const data = await fetchProductByIdAPI(id);
    return data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(extractErrorMessage(error));
  }
});

export const createProduct = createAsyncThunk('products/create', async (productData: any, thunkAPI) => {
  try {
    const data = await createProductAPI(productData);
    return data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(extractErrorMessage(error));
  }
});

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, productData }: { id: string; productData: any }, thunkAPI) => {
    try {
      const data = await updateProductAPI(id, productData);
      return data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const deleteProduct = createAsyncThunk('products/delete', async (id: string, thunkAPI) => {
  try {
    await deleteProductAPI(id);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(extractErrorMessage(error));
  }
});

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    resetProductState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action: PayloadAction<IProduct[]>) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get By Id
      .addCase(getProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action: PayloadAction<IProduct>) => {
        state.isLoading = false;
        state.product = action.payload;
      })
      .addCase(getProductById.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<IProduct>) => {
        state.isLoading = false;
        state.success = true;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Update
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<IProduct>) => {
        state.isLoading = false;
        state.success = true;
        state.products = state.products.map((p) => (p.id === action.payload.id ? action.payload : p));
        if (state.product?.id === action.payload.id) {
          state.product = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Delete
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProductState } = productSlice.actions;
export default productSlice.reducer;