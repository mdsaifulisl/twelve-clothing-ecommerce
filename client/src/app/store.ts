import { configureStore } from '@reduxjs/toolkit';
import searchReducer from '../features/search/searchSlice';
import cartReducer from '../features/cart/cartSlice';
import alertReducer from '../features/alert/alertSlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    cart: cartReducer,
    alert: alertReducer
    
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;