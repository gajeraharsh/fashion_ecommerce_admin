import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import productSlice from './slices/productSlice';
import orderSlice from './slices/orderSlice';
import userSlice from './slices/userSlice';
import transactionSlice from './slices/transactionSlice';
import inventorySlice from './slices/inventorySlice';
import couponSlice from './slices/couponSlice';
import dashboardSlice from './slices/dashboardSlice';
import faqSlice from './slices/faqSlice';
import newsletterSlice from './slices/newsletterSlice';
import seoSlice from './slices/seoSlice';
import auditSlice from './slices/auditSlice';
import instagramSlice from './slices/instagramSlice';
import blogSlice from './slices/blogSlice';
import bannerSlice from './slices/bannerSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productSlice,
    orders: orderSlice,
    users: userSlice,
    transactions: transactionSlice,
    inventory: inventorySlice,
    coupons: couponSlice,
    dashboard: dashboardSlice,
    faqs: faqSlice,
    newsletter: newsletterSlice,
    seo: seoSlice,
    audit: auditSlice,
    instagram: instagramSlice,
    blogs: blogSlice,
    banners: bannerSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
