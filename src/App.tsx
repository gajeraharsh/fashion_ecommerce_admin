import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { store } from './store';
import AdminLayout from './components/Layout/AdminLayout';
import LoginForm from './components/Auth/LoginForm';
import Dashboard from './pages/Dashboard/Dashboard';
import ProductList from './pages/Products/ProductList';
import ProductForm from './pages/Products/ProductForm';
import OrderList from './pages/Orders/OrderList';
import UserList from './pages/Users/UserList';
import TransactionList from './pages/Transactions/TransactionList';
import InventoryList from './pages/Inventory/InventoryList';
import CouponList from './pages/Coupons/CouponList';
import BannerList from './pages/Banners/BannerList';
import FAQList from './pages/FAQ/FAQList';
import SiteSettings from './pages/Settings/SiteSettings';
import BlogList from './pages/Blog/BlogList';
import NewsletterList from './pages/Newsletter/NewsletterList';
import VendorList from './pages/Vendors/VendorList';
import ProtectedRoute from './components/Auth/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890ff',
            borderRadius: 8,
            wireframe: false,
          },
          components: {
            Layout: {
              siderBg: '#ffffff',
              triggerBg: '#ffffff',
            },
            Menu: {
              itemBg: 'transparent',
              subMenuItemBg: 'transparent',
            },
          },
        }}
      >
        <Router>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/add" element={<ProductForm />} />
              <Route path="products/edit/:id" element={<ProductForm />} />
              <Route path="orders" element={<OrderList />} />
              {/* Add more routes for other modules */}
              <Route path="users" element={<UserList />} />
              <Route path="transactions" element={<TransactionList />} />
              <Route path="banners" element={<BannerList />} />
              <Route path="faqs" element={<FAQList />} />
              <Route path="settings" element={<SiteSettings />} />
              <Route path="blog" element={<BlogList />} />
              <Route path="instagram" element={<div className="p-6">Instagram Feed - Coming Soon</div>} />
              <Route path="coupons" element={<CouponList />} />
              <Route path="newsletter" element={<NewsletterList />} />
              <Route path="inventory" element={<InventoryList />} />
              <Route path="vendors" element={<div className="p-6">Vendor Management - Coming Soon</div>} />
              <Route path="seo" element={<div className="p-6">SEO Management - Coming Soon</div>} />
              <Route path="pages" element={<div className="p-6">Page Management - Coming Soon</div>} />
              <Route path="audit" element={<div className="p-6">Audit Logs - Coming Soon</div>} />
            </Route>
          </Routes>
        </Router>
      </ConfigProvider>
    </Provider>
  );
};

export default App;
