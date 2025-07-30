import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider, App as AntdApp } from 'antd';
import { store } from './store';
import AdminLayout from './components/Layout/AdminLayout';
import LoginForm from './components/Auth/LoginForm';
import Dashboard from './pages/Dashboard/Dashboard';
import ProductList from './pages/Products/ProductList';
import ProductForm from './pages/Products/ProductForm';
import OrderList from './pages/Orders/OrderList';
import UserList from './pages/Users/UserList';
import UserForm from './pages/Users/UserForm';
import TransactionList from './pages/Transactions/TransactionList';
import InventoryList from './pages/Inventory/InventoryList';
import CouponList from './pages/Coupons/CouponList';
import BannerList from './pages/Banners/BannerList';
import FAQList from './pages/FAQ/FAQList';
import SiteSettings from './pages/Settings/SiteSettings';
import BlogList from './pages/Blog/BlogList';
import NewsletterList from './pages/Newsletter/NewsletterList';
import VendorList from './pages/Vendors/VendorList';
import SEOManager from './pages/SEO/SEOManager';
import PageManager from './pages/PageManager/PageManager';
import AuditLogs from './pages/AuditLogs/AuditLogs';
import RolesPermissions from './pages/Users/RolesPermissions';
import Categories from './pages/Products/Categories';
import BulkUpload from './pages/Products/BulkUpload';
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
        <AntdApp>
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
              <Route path="users/add" element={<UserForm />} />
              <Route path="users/edit/:id" element={<UserForm />} />
              <Route path="users/roles" element={<RolesPermissions />} />
              <Route path="products/categories" element={<Categories />} />
              <Route path="products/bulk-upload" element={<BulkUpload />} />
              <Route path="transactions" element={<TransactionList />} />
              <Route path="banners" element={<BannerList />} />
              <Route path="faqs" element={<FAQList />} />
              <Route path="settings" element={<SiteSettings />} />
              <Route path="blog" element={<BlogList />} />
              <Route path="instagram" element={<div className="p-6">Instagram Feed - Coming Soon</div>} />
              <Route path="coupons" element={<CouponList />} />
              <Route path="newsletter" element={<NewsletterList />} />
              <Route path="inventory" element={<InventoryList />} />
              <Route path="vendors" element={<VendorList />} />
              <Route path="seo" element={<SEOManager />} />
              <Route path="pages" element={<PageManager />} />
              <Route path="audit" element={<AuditLogs />} />
            </Route>
          </Routes>
          </Router>
        </AntdApp>
      </ConfigProvider>
    </Provider>
  );
};

export default App;
