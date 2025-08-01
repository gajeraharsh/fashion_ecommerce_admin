import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Badge, theme } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  BankOutlined,
  PictureOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  FileTextOutlined,
  InstagramOutlined,
  GiftOutlined,
  MailOutlined,
  InboxOutlined,
  TeamOutlined,
  SafetyOutlined,
  FileSearchOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'user-management',
      icon: <UserOutlined />,
      label: 'User Management',
      children: [
        { key: '/users', label: 'All Users' },
        { key: '/users/roles', label: 'Roles & Permissions' },
      ],
    },
    {
      key: 'product-management',
      icon: <ShoppingOutlined />,
      label: 'Product Management',
      children: [
        { key: '/products', label: 'All Products' },
        { key: '/products/add', label: 'Add Product' },
        { key: '/products/categories', label: 'Categories' },
        { key: '/products/bulk-upload', label: 'Bulk Upload' },
      ],
    },
    {
      key: '/orders',
      icon: <ShoppingCartOutlined />,
      label: 'Order Management',
    },
    {
      key: '/transactions',
      icon: <BankOutlined />,
      label: 'Transactions',
    },
    {
      key: '/banners',
      icon: <PictureOutlined />,
      label: 'Banner Management',
    },
    {
      key: '/faqs',
      icon: <QuestionCircleOutlined />,
      label: 'FAQ Management',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Site Settings',
    },
    {
      key: '/blog',
      icon: <FileTextOutlined />,
      label: 'Blog Management',
    },
    {
      key: '/instagram',
      icon: <InstagramOutlined />,
      label: 'Instagram Feed',
    },
    {
      key: '/coupons',
      icon: <GiftOutlined />,
      label: 'Coupons & Discounts',
    },
    {
      key: '/newsletter',
      icon: <MailOutlined />,
      label: 'Newsletter',
    },
    {
      key: '/inventory',
      icon: <InboxOutlined />,
      label: 'Inventory',
    },

    {
      key: '/seo',
      icon: <FileSearchOutlined />,
      label: 'SEO Management',
    },
    {
      key: '/pages',
      icon: <FileTextOutlined />,
      label: 'Page Management',
    },
    {
      key: '/audit',
      icon: <SafetyOutlined />,
      label: 'Audit Logs',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingOutlined />,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
        style={{
          background: colorBgContainer,
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
        }}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <div className="text-xl font-bold text-blue-600">
            {collapsed ? 'FA' : 'Fashion Admin'}
          </div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{
            border: 'none',
            height: 'calc(100vh - 64px)',
          }}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'margin-left 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div className="flex items-center space-x-4">
            <Badge count={5}>
              <Button
                type="text"
                icon={<BellOutlined />}
                size="large"
                className="text-gray-600 hover:text-blue-600"
              />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg">
                <Avatar icon={<UserOutlined />} />
                <div className="hidden sm:block">
                  <div className="text-sm font-medium">{user?.name}</div>
                  <div className="text-xs text-gray-500">{user?.role}</div>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px',
            padding: '24px',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 'calc(100vh - 112px)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
