import React from 'react';
import { Card, Row, Col, Table, Button, Tag, Typography, Space, Switch, Checkbox } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  SafetyOutlined,
  CrownOutlined,
  TeamOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const RolesPermissions: React.FC = () => {
  const roles = [
    {
      key: '1',
      name: 'Super Admin',
      description: 'Full system access',
      userCount: 2,
      permissions: ['all'],
      color: 'red',
    },
    {
      key: '2',
      name: 'Admin',
      description: 'Administrative access',
      userCount: 5,
      permissions: ['users', 'products', 'orders', 'settings'],
      color: 'blue',
    },
    {
      key: '3',
      name: 'Manager',
      description: 'Management level access',
      userCount: 12,
      permissions: ['products', 'orders', 'inventory'],
      color: 'green',
    },
    {
      key: '4',
      name: 'Customer',
      description: 'Standard customer access',
      userCount: 1247,
      permissions: ['profile', 'orders'],
      color: 'orange',
    },
  ];

  const permissions = [
    { name: 'User Management', key: 'users', description: 'Create, edit, delete users' },
    { name: 'Product Management', key: 'products', description: 'Manage product catalog' },
    { name: 'Order Management', key: 'orders', description: 'Process and manage orders' },
    { name: 'Inventory Management', key: 'inventory', description: 'Stock and warehouse management' },
    { name: 'Financial Reports', key: 'financials', description: 'Access to financial data' },
    { name: 'System Settings', key: 'settings', description: 'Configure system settings' },
    { name: 'Analytics', key: 'analytics', description: 'View reports and analytics' },
    { name: 'Content Management', key: 'content', description: 'Manage blog and pages' },
  ];

  const roleColumns = [
    {
      title: 'Role',
      key: 'role',
      render: (record: any) => (
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full bg-${record.color}-500`}></div>
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-sm text-gray-500">{record.description}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Users',
      dataIndex: 'userCount',
      key: 'userCount',
      render: (count: number) => (
        <div className="text-center">
          <div className="text-lg font-semibold">{count.toLocaleString()}</div>
          <div className="text-xs text-gray-500">users</div>
        </div>
      ),
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => (
        <div className="flex flex-wrap gap-1">
          {permissions.includes('all') ? (
            <Tag color="red">ALL PERMISSIONS</Tag>
          ) : (
            permissions.map(perm => (
              <Tag key={perm} size="small">{perm}</Tag>
            ))
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-0">Roles & Permissions</Title>
          <p className="text-gray-600">Manage user roles and access permissions</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large">
          Create Role
        </Button>
      </div>

      {/* Role Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <CrownOutlined className="text-2xl text-red-500 mb-2" />
            <div className="text-lg font-bold">2</div>
            <div className="text-gray-600">Super Admins</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <SafetyOutlined className="text-2xl text-blue-500 mb-2" />
            <div className="text-lg font-bold">5</div>
            <div className="text-gray-600">Admins</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <TeamOutlined className="text-2xl text-green-500 mb-2" />
            <div className="text-lg font-bold">12</div>
            <div className="text-gray-600">Managers</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <UserOutlined className="text-2xl text-orange-500 mb-2" />
            <div className="text-lg font-bold">1,247</div>
            <div className="text-gray-600">Customers</div>
          </Card>
        </Col>
      </Row>

      {/* Roles Table */}
      <Card title="System Roles">
        <Table
          columns={roleColumns}
          dataSource={roles}
          pagination={false}
        />
      </Card>

      {/* Permissions Matrix */}
      <Card title="Permission Matrix">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Permission</th>
                <th className="text-center py-3 px-4">Super Admin</th>
                <th className="text-center py-3 px-4">Admin</th>
                <th className="text-center py-3 px-4">Manager</th>
                <th className="text-center py-3 px-4">Customer</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map(permission => (
                <tr key={permission.key} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium">{permission.name}</div>
                      <div className="text-sm text-gray-500">{permission.description}</div>
                    </div>
                  </td>
                  <td className="text-center py-3 px-4">
                    <Checkbox checked disabled />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Checkbox checked={['users', 'products', 'orders', 'settings'].includes(permission.key)} />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Checkbox checked={['products', 'orders', 'inventory'].includes(permission.key)} />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Checkbox checked={['profile', 'orders'].includes(permission.key)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Actions */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Quick Actions">
            <div className="space-y-3">
              <Button block icon={<PlusOutlined />}>Create New Role</Button>
              <Button block icon={<UserOutlined />}>Bulk Assign Roles</Button>
              <Button block icon={<SafetyOutlined />}>Security Audit</Button>
              <Button block icon={<EditOutlined />}>Edit Permissions</Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Role Templates">
            <div className="space-y-3">
              <Button block>E-commerce Manager</Button>
              <Button block>Content Editor</Button>
              <Button block>Customer Support</Button>
              <Button block>Analytics Viewer</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RolesPermissions;
