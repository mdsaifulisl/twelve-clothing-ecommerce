/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchUsersAPI,
  fetchUserByIdAPI,
  createUserAPI,
  updateUserAPI,
  deleteUserAPI,
} from './userApi';
import type { UserState, UpdateUserData } from './userType';

const initialState: UserState = {
  users: [],
  user: null,
  isLoading: false,
  error: null,
  success: false,
};

// Async Thunks
export const getUsers = createAsyncThunk('user/getUsers', async (_, thunkAPI) => {
  try {
    const data = await fetchUsersAPI();
    return data.data; // আপনার backend sendResponse-এর data structure অনুযায়ী
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getUserById = createAsyncThunk('user/getUserById', async (id: string, thunkAPI) => {
  try {
    const data = await fetchUserByIdAPI(id);
    return data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const createUser = createAsyncThunk('user/createUser', async (userData: object, thunkAPI) => {
  try {
    const data = await createUserAPI(userData);
    return data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ id, userData }: { id: string; userData: UpdateUserData }, thunkAPI) => {
    try {
      const data = await updateUserAPI(id, userData);
      return data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteUser = createAsyncThunk('user/deleteUser', async (id: string, thunkAPI) => {
  try {
    await deleteUserAPI(id);
    return id; // ডিলিট করার পর আইডি রিটার্ন করা হলো স্টেট থেকে ফিল্টার করার জন্য
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Users
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Get User By ID
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Create User
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.users.unshift(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update User
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.users = state.users.map((u) => (u.id === action.payload.id ? action.payload : u));
        if (state.user?.id === action.payload.id) {
          state.user = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.users = state.users.filter((u) => u.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;