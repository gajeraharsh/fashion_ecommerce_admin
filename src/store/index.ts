import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import productSlice from './slices/productSlice';
import orderSlice from './slices/orderSlice';
import userSlice from './slices/userSlice';
import transactionSlice from './slices/transactionSlice';
import inventorySlice from './slices/inventorySlice';
import dashboardSlice from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productSlice,
    orders: orderSlice,
    users: userSlice,
    transactions: transactionSlice,
    dashboard: dashboardSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
