import { configureStore } from '@reduxjs/toolkit';
import searchReducer from '../features/search/searchSlice';
import cartReducer from '../features/cart/cartSlice';
import alertReducer from '../features/alert/alertSlice';
import modalReducer from '../features/alert/modalSlice';

// Configure Store
import productReducer from '../features/product/ProductSlice';
import customerManagementReducer from '../features/customer/customerSlice';
import orderReducer from '../features/order/orderSlice';
import sliderReducer from '../features/slider/sliderSlice';
import storeLocationReducer from '../features/storeLocation/storeLocationSlice';
import aboutSectionReducer from '../features/aboutSection/aboutSectionSlice';
import settingsReducer from '../features/settings/settingsSlice';
import termsReducer from '../features/terms/termsSlice';
import faqReducer from '../features/faq/faqSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import logReducer from '../features/logs/logSlice';
import userReducer from '../features/user/userSlice';
import authReducer from '../features/auth/authSlice';


export const store = configureStore({
  reducer: {
    search: searchReducer,
    cart: cartReducer,
    alert: alertReducer,
    modal: modalReducer,
    product: productReducer,
    customerManagement: customerManagementReducer,
    orders: orderReducer,
    sliders: sliderReducer,
    storeLocations: storeLocationReducer,
    aboutSection: aboutSectionReducer,
    settings: settingsReducer,
    terms: termsReducer,
    faq: faqReducer,
    dashboard: dashboardReducer,
    user: userReducer,
    logs: logReducer,
    auth: authReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
