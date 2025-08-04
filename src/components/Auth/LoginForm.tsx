import React, { useEffect } from 'react';
import { Form, Input, Button, Card, Alert, Typography, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, ShopOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { RootState, AppDispatch } from '../../store';
import authService from '../../services/authService';

const { Title, Text } = Typography;

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [form] = Form.useForm();

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());
    
    // Redirect if already authenticated and is admin
    if (isAuthenticated && user && authService.isAdmin()) {
      navigate('/dashboard');
    }
  }, [dispatch, isAuthenticated, user, navigate]);

  const onFinish = async (values: LoginFormData) => {
    try {
      const result = await dispatch(loginUser(values)).unwrap();
      
      // Check if user is admin
      if (result.user.role !== 'ADMIN') {
        dispatch(clearError());
        form.setFields([
          {
            name: 'email',
            errors: ['Admin access required. Please contact your administrator.']
          }
        ]);
        // Logout the non-admin user
        authService.logout();
        return;
      }
      
      // Redirect to dashboard on successful admin login
      navigate('/dashboard');
    } catch (error) {
      // Error is already handled by the rejected case in the slice
      console.error('Login failed:', error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          borderRadius: '16px',
          border: 'none'
        }}
        bodyStyle={{ padding: '40px' }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
          <div>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1890ff, #722ed1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 8px 20px rgba(24, 144, 255, 0.3)'
            }}>
              <ShopOutlined style={{ fontSize: '36px', color: 'white' }} />
            </div>
            <Title level={2} style={{ margin: '0 0 8px 0', color: '#262626', fontWeight: 600 }}>
              Fashion Admin
            </Title>
            <Text type="secondary" style={{ fontSize: '15px' }}>
              Welcome back! Please sign in to your admin account.
            </Text>
          </div>

          <Divider style={{ margin: '20px 0' }} />

          {error && (
            <Alert
              message="Login Failed"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => dispatch(clearError())}
              style={{ textAlign: 'left', borderRadius: '8px' }}
            />
          )}

          <Form
            form={form}
            name="adminLogin"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
            size="large"
            autoComplete="off"
          >
            <Form.Item
              name="email"
              label={<span style={{ fontWeight: 500 }}>Email Address</span>}
              rules={[
                { required: true, message: 'Please input your email address!' },
                { type: 'email', message: 'Please enter a valid email address!' }
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="admin@example.com"
                autoComplete="email"
                style={{ borderRadius: '8px', padding: '12px' }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span style={{ fontWeight: 500 }}>Password</span>}
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Enter your password"
                autoComplete="current-password"
                style={{ borderRadius: '8px', padding: '12px' }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: '16px' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                icon={<LoginOutlined />}
                style={{
                  height: '50px',
                  fontSize: '16px',
                  fontWeight: 500,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #1890ff, #722ed1)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
                }}
              >
                {loading ? 'Signing In...' : 'Sign In to Admin Panel'}
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Text type="secondary" style={{ fontSize: '13px' }}>
              Secure admin access • Fashion E-commerce Platform
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px', marginTop: '8px' }}>
              © 2024 Fashion Admin Panel. All rights reserved.
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default LoginForm;
