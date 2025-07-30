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
              <Route path="transactions" element={<div className="p-6">Transactions - Coming Soon</div>} />
              <Route path="banners" element={<div className="p-6">Banner Management - Coming Soon</div>} />
              <Route path="faqs" element={<div className="p-6">FAQ Management - Coming Soon</div>} />
              <Route path="settings" element={<div className="p-6">Site Settings - Coming Soon</div>} />
              <Route path="blog" element={<div className="p-6">Blog Management - Coming Soon</div>} />
              <Route path="instagram" element={<div className="p-6">Instagram Feed - Coming Soon</div>} />
              <Route path="coupons" element={<div className="p-6">Coupons & Discounts - Coming Soon</div>} />
              <Route path="newsletter" element={<div className="p-6">Newsletter - Coming Soon</div>} />
              <Route path="inventory" element={<div className="p-6">Inventory - Coming Soon</div>} />
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
