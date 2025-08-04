import React, { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Modal,
  Form,
  message,
  Avatar,
  Badge,
  Drawer,
  Descriptions,
  Row,
  Col,
  Statistic,
  Switch,
  Popconfirm,
  DatePicker,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
  MailOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchUsers, updateUser, deleteUser } from '../../store/slices/userSlice';
import { User } from '../../services/userService';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface UserListProps {}
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'customer' | 'vendor';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  emailVerified: boolean;
  phoneVerified: boolean;
  totalOrders: number;
  totalSpent: number;
  lastLogin: string;
  createdAt: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    newsletter: boolean;
    sms: boolean;
    orderUpdates: boolean;
  };
  loyaltyPoints: number;
  birthday?: string;
  gender?: 'male' | 'female' | 'other';
}

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading } = useSelector((state: RootState) => state.users);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockUsers: User[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1-234-567-8901',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
        role: 'customer',
        status: 'active',
        emailVerified: true,
        phoneVerified: true,
        totalOrders: 12,
        totalSpent: 2456.78,
        lastLogin: '2024-01-07T10:30:00Z',
        createdAt: '2023-06-15T08:00:00Z',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
        },
        preferences: {
          newsletter: true,
          sms: false,
          orderUpdates: true,
        },
        loyaltyPoints: 1250,
        birthday: '1990-05-15',
        gender: 'male',
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '+1-234-567-8902',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
        role: 'manager',
        status: 'active',
        emailVerified: true,
        phoneVerified: false,
        totalOrders: 0,
        totalSpent: 0,
        lastLogin: '2024-01-07T09:15:00Z',
        createdAt: '2024-01-01T10:00:00Z',
        preferences: {
          newsletter: false,
          sms: false,
          orderUpdates: true,
        },
        loyaltyPoints: 0,
        gender: 'female',
      },
      {
        id: '3',
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike@example.com',
        phone: '+1-234-567-8903',
        role: 'customer',
        status: 'pending',
        emailVerified: false,
        phoneVerified: false,
        totalOrders: 1,
        totalSpent: 89.99,
        lastLogin: '2024-01-05T14:20:00Z',
        createdAt: '2024-01-05T14:00:00Z',
        preferences: {
          newsletter: true,
          sms: true,
          orderUpdates: true,
        },
        loyaltyPoints: 45,
        birthday: '1985-12-03',
        gender: 'male',
      },
      {
        id: '4',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@fashion.com',
        role: 'admin',
        status: 'active',
        emailVerified: true,
        phoneVerified: true,
        totalOrders: 0,
        totalSpent: 0,
        lastLogin: '2024-01-07T11:00:00Z',
        createdAt: '2023-01-01T00:00:00Z',
        preferences: {
          newsletter: false,
          sms: false,
          orderUpdates: false,
        },
        loyaltyPoints: 0,
      },
    ];

    // For now, we'll use fetchUsers to load real data from the API
    // dispatch(fetchUsers({}));
  }, [dispatch]);

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'red',
      manager: 'blue',
      customer: 'green',
      vendor: 'purple',
    };
    return colors[role as keyof typeof colors] || 'default';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'green',
      inactive: 'gray',
      pending: 'orange',
      suspended: 'red',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    form.setFieldsValue(user);
    setEditVisible(true);
  };

  const handleSave = async (values: any) => {
    if (selectedUser) {
      dispatch(updateUser({ id: selectedUser.id, userData: values }));
      message.success('User updated successfully');
      setEditVisible(false);
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete User',
      content: 'Are you sure you want to delete this user? This action cannot be undone.',
      onOk: () => {
        dispatch(deleteUser(id));
        message.success('User deleted successfully');
      },
    });
  };

  const showUserDetails = (user: User) => {
    setSelectedUser(user);
    setDetailsVisible(true);
  };

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (record: User) => (
        <div className="flex items-center space-x-3">
          <Avatar
            size={50}
            src={record.avatar}
            icon={<UserAddOutlined />}
            className="border-2 border-gray-200"
          />
          <div>
            <div className="font-medium text-gray-900">
              {record.firstName} {record.lastName}
            </div>
            <div className="text-sm text-gray-500">{record.email}</div>
            <div className="flex items-center space-x-2 mt-1">
              {record.emailVerified ? (
                <CheckCircleOutlined className="text-green-500" />
              ) : (
                <CloseCircleOutlined className="text-red-500" />
              )}
              {record.phone && (
                <span className="text-xs text-gray-400">{record.phone}</span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={getRoleColor(role)} icon={role === 'admin' ? <CrownOutlined /> : <TeamOutlined />}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Orders',
      key: 'orders',
      render: (record: User) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">{record.totalOrders}</div>
          <div className="text-xs text-gray-500">orders</div>
        </div>
      ),
    },
    {
      title: 'Total Spent',
      key: 'spent',
      render: (record: User) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">
            ${record.totalSpent.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">lifetime</div>
        </div>
      ),
    },
    {
      title: 'Loyalty Points',
      dataIndex: 'loyaltyPoints',
      key: 'loyaltyPoints',
      render: (points: number) => (
        <Badge count={points} showZero style={{ backgroundColor: '#f5a623' }} />
      ),
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (date: string) => (
        <div className="text-sm">
          <div>{new Date(date).toLocaleDateString()}</div>
          <div className="text-gray-500">{new Date(date).toLocaleTimeString()}</div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: User) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => showUserDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Edit User">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete User">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalSpent = users.reduce((sum, user) => sum + user.totalSpent, 0);
  const totalOrders = users.reduce((sum, user) => sum + user.totalOrders, 0);
  const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/users/add')}
          size="large"
        >
          Add New User
        </Button>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Users"
              value={totalUsers}
              valueStyle={{ color: '#1890ff', fontSize: '28px', fontWeight: 'bold' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Active Users"
              value={activeUsers}
              valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: 'bold' }}
              prefix={<CheckCircleOutlined />}
              suffix={
                <div className="text-sm text-gray-500 mt-1">
                  {((activeUsers / totalUsers) * 100).toFixed(1)}% active
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Revenue"
              value={totalSpent}
              precision={2}
              valueStyle={{ color: '#f5a623', fontSize: '28px', fontWeight: 'bold' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Avg Order Value"
              value={averageOrderValue}
              precision={2}
              valueStyle={{ color: '#722ed1', fontSize: '28px', fontWeight: 'bold' }}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* User Role Distribution */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="User Role Distribution">
            <Row gutter={[16, 16]}>
              {['admin', 'manager', 'customer', 'vendor'].map(role => {
                const count = users.filter(u => u.role === role).length;
                const percentage = (count / totalUsers) * 100;
                return (
                  <Col key={role} xs={12} sm={6}>
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-2" style={{ color: getRoleColor(role) === 'red' ? '#ff4d4f' : getRoleColor(role) === 'blue' ? '#1890ff' : getRoleColor(role) === 'green' ? '#52c41a' : '#722ed1' }}>
                        {count}
                      </div>
                      <Progress
                        percent={percentage}
                        size="small"
                        strokeColor={getRoleColor(role) === 'red' ? '#ff4d4f' : getRoleColor(role) === 'blue' ? '#1890ff' : getRoleColor(role) === 'green' ? '#52c41a' : '#722ed1'}
                        showInfo={false}
                      />
                      <div className="text-sm text-gray-600 mt-1 capitalize">{role}s</div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4 items-center">
          <Search
            placeholder="Search users by name or email..."
            allowClear
            style={{ width: 300 }}
            onSearch={setSearchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            style={{ width: 150 }}
            value={roleFilter}
            onChange={setRoleFilter}
            placeholder="Filter by role"
          >
            <Option value="all">All Roles</Option>
            <Option value="admin">Admin</Option>
            <Option value="manager">Manager</Option>
            <Option value="customer">Customer</Option>
            <Option value="vendor">Vendor</Option>
          </Select>
          <Select
            style={{ width: 150 }}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filter by status"
          >
            <Option value="all">All Status</Option>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
            <Option value="pending">Pending</Option>
            <Option value="suspended">Suspended</Option>
          </Select>
          <RangePicker placeholder={['Start Date', 'End Date']} />
          <Button
            onClick={() => {
              setSearchText('');
              setRoleFilter('all');
              setStatusFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
          }}
          className="overflow-x-auto"
        />
      </Card>

      {/* User Details Drawer */}
      <Drawer
        title={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : 'User Details'}
        open={detailsVisible}
        onClose={() => setDetailsVisible(false)}
        width={600}
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* User Avatar and Basic Info */}
            <div className="text-center border-b pb-6">
              <Avatar
                size={100}
                src={selectedUser.avatar}
                icon={<UserAddOutlined />}
                className="mb-4"
              />
              <h2 className="text-xl font-bold">
                {selectedUser.firstName} {selectedUser.lastName}
              </h2>
              <p className="text-gray-600">{selectedUser.email}</p>
              <div className="flex justify-center space-x-4 mt-4">
                <Tag color={getRoleColor(selectedUser.role)}>{selectedUser.role.toUpperCase()}</Tag>
                <Tag color={getStatusColor(selectedUser.status)}>{selectedUser.status.toUpperCase()}</Tag>
              </div>
            </div>

            {/* Contact Information */}
            <Descriptions title="Contact Information" column={1} size="small">
              <Descriptions.Item label="Email" icon={<MailOutlined />}>
                <div className="flex items-center space-x-2">
                  <span>{selectedUser.email}</span>
                  {selectedUser.emailVerified ? (
                    <CheckCircleOutlined className="text-green-500" />
                  ) : (
                    <CloseCircleOutlined className="text-red-500" />
                  )}
                </div>
              </Descriptions.Item>
              {selectedUser.phone && (
                <Descriptions.Item label="Phone" icon={<PhoneOutlined />}>
                  <div className="flex items-center space-x-2">
                    <span>{selectedUser.phone}</span>
                    {selectedUser.phoneVerified ? (
                      <CheckCircleOutlined className="text-green-500" />
                    ) : (
                      <CloseCircleOutlined className="text-red-500" />
                    )}
                  </div>
                </Descriptions.Item>
              )}
              {selectedUser.address && (
                <Descriptions.Item label="Address" icon={<EnvironmentOutlined />}>
                  {selectedUser.address.street}<br />
                  {selectedUser.address.city}, {selectedUser.address.state} {selectedUser.address.zipCode}<br />
                  {selectedUser.address.country}
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* Shopping Statistics */}
            <Descriptions title="Shopping Statistics" column={2} size="small">
              <Descriptions.Item label="Total Orders">{selectedUser.totalOrders}</Descriptions.Item>
              <Descriptions.Item label="Total Spent">${selectedUser.totalSpent.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Loyalty Points">{selectedUser.loyaltyPoints}</Descriptions.Item>
              <Descriptions.Item label="Avg Order Value">
                ${selectedUser.totalOrders > 0 ? (selectedUser.totalSpent / selectedUser.totalOrders).toFixed(2) : '0.00'}
              </Descriptions.Item>
            </Descriptions>

            {/* Account Information */}
            <Descriptions title="Account Information" column={1} size="small">
              <Descriptions.Item label="Member Since">
                {new Date(selectedUser.createdAt).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Last Login">
                {new Date(selectedUser.lastLogin).toLocaleString()}
              </Descriptions.Item>
              {selectedUser.birthday && (
                <Descriptions.Item label="Birthday">
                  {new Date(selectedUser.birthday).toLocaleDateString()}
                </Descriptions.Item>
              )}
              {selectedUser.gender && (
                <Descriptions.Item label="Gender">
                  {selectedUser.gender.charAt(0).toUpperCase() + selectedUser.gender.slice(1)}
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* Preferences */}
            <div>
              <h3 className="text-lg font-medium mb-3">Communication Preferences</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Newsletter Subscription</span>
                  <Switch checked={selectedUser.preferences.newsletter} disabled />
                </div>
                <div className="flex justify-between items-center">
                  <span>SMS Notifications</span>
                  <Switch checked={selectedUser.preferences.sms} disabled />
                </div>
                <div className="flex justify-between items-center">
                  <span>Order Updates</span>
                  <Switch checked={selectedUser.preferences.orderUpdates} disabled />
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        open={editVisible}
        onCancel={() => setEditVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          className="mt-4"
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter valid email' }
            ]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: 'Please select role' }]}
              >
                <Select>
                  <Option value="admin">Admin</Option>
                  <Option value="manager">Manager</Option>
                  <Option value="customer">Customer</Option>
                  <Option value="vendor">Vendor</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="suspended">Suspended</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setEditVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">Save Changes</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;
