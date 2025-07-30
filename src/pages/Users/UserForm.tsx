import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Select, 
  Switch, 
  DatePicker, 
  Upload, 
  Avatar, 
  Row, 
  Col, 
  message, 
  Divider,
  Space,
  Tag
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  UploadOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  LockOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';

const { Option } = Select;
const { TextArea } = Input;

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
  dateOfBirth?: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  bio: string;
  permissions: string[];
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

const UserForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  const isEditing = Boolean(id);

  const roles = [
    { value: 'admin', label: 'Administrator', color: 'red' },
    { value: 'manager', label: 'Manager', color: 'blue' },
    { value: 'editor', label: 'Editor', color: 'green' },
    { value: 'viewer', label: 'Viewer', color: 'default' },
    { value: 'customer', label: 'Customer', color: 'orange' },
  ];

  const departments = [
    'IT & Technology',
    'Sales & Marketing',
    'Customer Support',
    'Human Resources',
    'Finance & Accounting',
    'Operations',
    'Design & Creative',
    'Content & SEO',
  ];

  const permissions = [
    'users.create',
    'users.read',
    'users.update',
    'users.delete',
    'products.create',
    'products.read',
    'products.update',
    'products.delete',
    'orders.read',
    'orders.update',
    'analytics.read',
    'settings.update',
    'content.create',
    'content.update',
  ];

  useEffect(() => {
    if (isEditing) {
      // Load user data for editing
      const userData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 234 567 8900',
        role: 'manager',
        department: 'Sales & Marketing',
        status: 'active',
        address: '123 Main Street',
        city: 'New York',
        country: 'United States',
        postalCode: '10001',
        bio: 'Experienced sales manager with 5+ years in e-commerce',
        permissions: ['users.read', 'products.read', 'orders.read'],
        twoFactorEnabled: true,
        emailNotifications: true,
        smsNotifications: false,
      };
      form.setFieldsValue(userData);
    }
  }, [isEditing, form, id]);

  const handleSubmit = async (values: UserFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success(`User ${isEditing ? 'updated' : 'created'} successfully!`);
      navigate('/users');
    } catch (error) {
      message.error('Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = (info: any) => {
    if (info.file.status === 'done') {
      setAvatarUrl(info.file.response?.url || URL.createObjectURL(info.file.originFileObj));
      message.success('Avatar uploaded successfully');
    } else if (info.file.status === 'error') {
      message.error('Avatar upload failed');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/users')}
          >
            Back to Users
          </Button>
          <h1 className="text-2xl font-bold m-0">
            {isEditing ? 'Edit User' : 'Add New User'}
          </h1>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: 'active',
          twoFactorEnabled: false,
          emailNotifications: true,
          smsNotifications: false,
          permissions: [],
        }}
      >
        <Row gutter={24}>
          <Col xs={24} lg={16}>
            <Card title="Basic Information" className="mb-6">
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="name"
                    label="Full Name"
                    rules={[{ required: true, message: 'Please enter full name' }]}
                  >
                    <Input 
                      prefix={<UserOutlined />} 
                      placeholder="Enter full name"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="email"
                    label="Email Address"
                    rules={[
                      { required: true, message: 'Please enter email' },
                      { type: 'email', message: 'Please enter valid email' }
                    ]}
                  >
                    <Input 
                      prefix={<MailOutlined />} 
                      placeholder="Enter email address"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={[{ required: true, message: 'Please enter phone number' }]}
                  >
                    <Input 
                      prefix={<PhoneOutlined />} 
                      placeholder="Enter phone number"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="role"
                    label="User Role"
                    rules={[{ required: true, message: 'Please select a role' }]}
                  >
                    <Select placeholder="Select user role" size="large">
                      {roles.map(role => (
                        <Option key={role.value} value={role.value}>
                          <Tag color={role.color}>{role.label}</Tag>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="department"
                    label="Department"
                  >
                    <Select placeholder="Select department" size="large">
                      {departments.map(dept => (
                        <Option key={dept} value={dept}>{dept}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="status"
                    label="Account Status"
                    rules={[{ required: true, message: 'Please select status' }]}
                  >
                    <Select size="large">
                      <Option value="active">
                        <Tag color="green">Active</Tag>
                      </Option>
                      <Option value="inactive">
                        <Tag color="orange">Inactive</Tag>
                      </Option>
                      <Option value="suspended">
                        <Tag color="red">Suspended</Tag>
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card title="Address Information" className="mb-6">
              <Row gutter={16}>
                <Col xs={24}>
                  <Form.Item
                    name="address"
                    label="Street Address"
                  >
                    <Input 
                      placeholder="Enter street address"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item
                    name="city"
                    label="City"
                  >
                    <Input 
                      placeholder="Enter city"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item
                    name="country"
                    label="Country"
                  >
                    <Select 
                      placeholder="Select country"
                      size="large"
                      showSearch
                    >
                      <Option value="US">United States</Option>
                      <Option value="CA">Canada</Option>
                      <Option value="UK">United Kingdom</Option>
                      <Option value="AU">Australia</Option>
                      <Option value="DE">Germany</Option>
                      <Option value="FR">France</Option>
                      <Option value="JP">Japan</Option>
                      <Option value="IN">India</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item
                    name="postalCode"
                    label="Postal Code"
                  >
                    <Input 
                      placeholder="Enter postal code"
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card title="Permissions & Access" className="mb-6">
              <Form.Item
                name="permissions"
                label="User Permissions"
              >
                <Select
                  mode="multiple"
                  placeholder="Select permissions"
                  size="large"
                  style={{ width: '100%' }}
                >
                  {permissions.map(permission => (
                    <Option key={permission} value={permission}>
                      {permission.replace('.', ' > ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Profile Picture" className="mb-6">
              <div className="text-center">
                <Avatar 
                  size={120} 
                  src={avatarUrl} 
                  icon={<UserOutlined />}
                  className="mb-4"
                />
                <Upload
                  name="avatar"
                  listType="picture"
                  showUploadList={false}
                  action="/api/upload"
                  onChange={handleAvatarUpload}
                >
                  <Button icon={<UploadOutlined />} block>
                    Upload Avatar
                  </Button>
                </Upload>
              </div>
            </Card>

            <Card title="Additional Info" className="mb-6">
              <Form.Item
                name="dateOfBirth"
                label="Date of Birth"
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="bio"
                label="Bio"
              >
                <TextArea 
                  rows={4}
                  placeholder="Enter user bio or description"
                />
              </Form.Item>
            </Card>

            <Card title="Security & Notifications" className="mb-6">
              <Form.Item
                name="twoFactorEnabled"
                label="Two-Factor Authentication"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Divider />

              <Form.Item
                name="emailNotifications"
                label="Email Notifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="smsNotifications"
                label="SMS Notifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Card>

            {!isEditing && (
              <Card title="Initial Password" className="mb-6">
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: 'Please enter password' },
                    { min: 8, message: 'Password must be at least 8 characters' }
                  ]}
                >
                  <Input.Password 
                    prefix={<LockOutlined />}
                    placeholder="Enter initial password"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Confirm Password"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Please confirm password' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Passwords do not match'));
                      },
                    }),
                  ]}
                >
                  <Input.Password 
                    prefix={<LockOutlined />}
                    placeholder="Confirm password"
                    size="large"
                  />
                </Form.Item>
              </Card>
            )}
          </Col>
        </Row>

        <div className="text-right">
          <Space>
            <Button 
              size="large"
              onClick={() => navigate('/users')}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              icon={<SaveOutlined />}
              size="large"
            >
              {isEditing ? 'Update User' : 'Create User'}
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default UserForm;
