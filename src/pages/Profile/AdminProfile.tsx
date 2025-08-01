import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Avatar,
  Upload,
  Row,
  Col,
  Typography,
  Divider,
  Space,
  Tabs,
  Alert,
  App,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  LockOutlined,
  UploadOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const AdminProfile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  // Mock current user data
  const currentUser = {
    id: '1',
    name: user?.name || 'Admin User',
    email: user?.email || 'admin@fashion.com',
    phone: '+1 (555) 123-4567',
    role: user?.role || 'Super Admin',
    avatar: '',
    joinDate: '2023-01-15',
    lastLogin: '2024-01-10 14:30:00',
    department: 'IT Management',
    location: 'New York, USA',
  };

  const handleProfileUpdate = async (values: ProfileFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      message.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      message.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values: PasswordFormData) => {
    setPasswordLoading(true);
    try {
      // Validate passwords match
      if (values.newPassword !== values.confirmPassword) {
        message.error('New passwords do not match');
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success('Password changed successfully!');
      passwordForm.resetFields();
    } catch (error) {
      message.error('Failed to change password. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAvatarUpload = (info: any) => {
    if (info.file.status === 'done') {
      message.success('Avatar updated successfully!');
    } else if (info.file.status === 'error') {
      message.error('Failed to upload avatar');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2} className="mb-2">
          <UserOutlined className="mr-2" />
          Admin Profile
        </Title>
        <Text type="secondary">Manage your account settings and security</Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* Profile Overview */}
        <Col xs={24} lg={8}>
          <Card className="text-center">
            <div className="mb-4">
              <Avatar
                size={120}
                icon={<UserOutlined />}
                src={currentUser.avatar}
                className="mb-4"
              />
              <Upload
                name="avatar"
                action="/api/upload/avatar"
                showUploadList={false}
                onChange={handleAvatarUpload}
              >
                <Button icon={<UploadOutlined />} size="small">
                  Change Avatar
                </Button>
              </Upload>
            </div>
            
            <Title level={4} className="mb-1">{currentUser.name}</Title>
            <Text type="secondary" className="block mb-4">{currentUser.role}</Text>
            
            <div className="text-left space-y-2">
              <div className="flex justify-between">
                <Text strong>Email:</Text>
                <Text>{currentUser.email}</Text>
              </div>
              <div className="flex justify-between">
                <Text strong>Phone:</Text>
                <Text>{currentUser.phone}</Text>
              </div>
              <div className="flex justify-between">
                <Text strong>Department:</Text>
                <Text>{currentUser.department}</Text>
              </div>
              <div className="flex justify-between">
                <Text strong>Location:</Text>
                <Text>{currentUser.location}</Text>
              </div>
              <div className="flex justify-between">
                <Text strong>Join Date:</Text>
                <Text>{new Date(currentUser.joinDate).toLocaleDateString()}</Text>
              </div>
              <div className="flex justify-between">
                <Text strong>Last Login:</Text>
                <Text>{currentUser.lastLogin}</Text>
              </div>
            </div>
          </Card>
        </Col>

        {/* Profile Settings */}
        <Col xs={24} lg={16}>
          <Card>
            <Tabs defaultActiveKey="profile">
              <TabPane tab="Profile Information" key="profile">
                <div className="flex justify-between items-center mb-6">
                  <Title level={4} className="mb-0">Personal Information</Title>
                  <Button
                    type={editing ? "default" : "primary"}
                    icon={<EditOutlined />}
                    onClick={() => setEditing(!editing)}
                  >
                    {editing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>

                <Form
                  form={profileForm}
                  layout="vertical"
                  onFinish={handleProfileUpdate}
                  initialValues={currentUser}
                  disabled={!editing}
                >
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="name"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please enter your name' }]}
                      >
                        <Input size="large" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="email"
                        label="Email Address"
                        rules={[
                          { required: true, message: 'Please enter your email' },
                          { type: 'email', message: 'Please enter a valid email' }
                        ]}
                      >
                        <Input size="large" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="phone"
                        label="Phone Number"
                        rules={[{ required: true, message: 'Please enter your phone' }]}
                      >
                        <Input size="large" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="department"
                        label="Department"
                      >
                        <Input size="large" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="location"
                    label="Location"
                  >
                    <Input size="large" />
                  </Form.Item>

                  {editing && (
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        icon={<SaveOutlined />}
                        size="large"
                      >
                        Save Changes
                      </Button>
                    </Form.Item>
                  )}
                </Form>
              </TabPane>

              <TabPane tab="Change Password" key="password">
                <Title level={4} className="mb-4">Security Settings</Title>
                
                <Alert
                  message="Password Requirements"
                  description="Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters."
                  type="info"
                  className="mb-6"
                />

                <Form
                  form={passwordForm}
                  layout="vertical"
                  onFinish={handlePasswordChange}
                  style={{ maxWidth: 400 }}
                >
                  <Form.Item
                    name="currentPassword"
                    label="Current Password"
                    rules={[{ required: true, message: 'Please enter your current password' }]}
                  >
                    <Input.Password
                      size="large"
                      placeholder="Enter current password"
                      iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                    />
                  </Form.Item>

                  <Form.Item
                    name="newPassword"
                    label="New Password"
                    rules={[
                      { required: true, message: 'Please enter your new password' },
                      { min: 8, message: 'Password must be at least 8 characters' },
                      {
                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                        message: 'Password must contain uppercase, lowercase, number and special character'
                      }
                    ]}
                  >
                    <Input.Password
                      size="large"
                      placeholder="Enter new password"
                      iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                    />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    label="Confirm New Password"
                    dependencies={['newPassword']}
                    rules={[
                      { required: true, message: 'Please confirm your new password' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Passwords do not match!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      size="large"
                      placeholder="Confirm new password"
                      iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Space>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={passwordLoading}
                        icon={<LockOutlined />}
                        size="large"
                      >
                        Change Password
                      </Button>
                      <Button
                        size="large"
                        onClick={() => passwordForm.resetFields()}
                      >
                        Reset Form
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              </TabPane>

              <TabPane tab="Account Security" key="security">
                <Title level={4} className="mb-4">Security Overview</Title>
                
                <div className="space-y-6">
                  <Card size="small">
                    <div className="flex justify-between items-center">
                      <div>
                        <Text strong>Two-Factor Authentication</Text>
                        <div className="text-sm text-gray-500">Add an extra layer of security</div>
                      </div>
                      <Button type="primary" ghost>Enable 2FA</Button>
                    </div>
                  </Card>

                  <Card size="small">
                    <div className="flex justify-between items-center">
                      <div>
                        <Text strong>Login Sessions</Text>
                        <div className="text-sm text-gray-500">Manage your active sessions</div>
                      </div>
                      <Button>View Sessions</Button>
                    </div>
                  </Card>

                  <Card size="small">
                    <div className="flex justify-between items-center">
                      <div>
                        <Text strong>Security Log</Text>
                        <div className="text-sm text-gray-500">View recent security events</div>
                      </div>
                      <Button>View Log</Button>
                    </div>
                  </Card>

                  <Card size="small">
                    <div className="flex justify-between items-center">
                      <div>
                        <Text strong>Account Recovery</Text>
                        <div className="text-sm text-gray-500">Set up account recovery options</div>
                      </div>
                      <Button>Configure</Button>
                    </div>
                  </Card>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminProfile;
