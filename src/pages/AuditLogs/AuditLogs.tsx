import React from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Typography,
  Select,
  DatePicker,
  Input,
  Button,
} from "antd";
import {
  SafetyOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  LoginOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
  SearchOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const AuditLogs: React.FC = () => {
  const mockLogs = [
    {
      key: "1",
      timestamp: "2024-01-07 10:30:45",
      user: "admin@fashion.com",
      action: "Login",
      resource: "Authentication",
      details: "Successful login from IP 192.168.1.100",
      status: "success",
      ip: "192.168.1.100",
    },
    {
      key: "2",
      timestamp: "2024-01-07 10:32:12",
      user: "admin@fashion.com",
      action: "Product Update",
      resource: "Product #123",
      details: "Updated product price from $299.99 to $279.99",
      status: "success",
      ip: "192.168.1.100",
    },
    {
      key: "3",
      timestamp: "2024-01-07 10:35:30",
      user: "manager@fashion.com",
      action: "Order Status Change",
      resource: "Order #ORD-001",
      details: 'Changed order status from "Processing" to "Shipped"',
      status: "success",
      ip: "192.168.1.101",
    },
    {
      key: "4",
      timestamp: "2024-01-07 09:15:22",
      user: "unknown",
      action: "Failed Login",
      resource: "Authentication",
      details: "Failed login attempt for user admin@fashion.com",
      status: "failed",
      ip: "192.168.1.105",
    },
    {
      key: "5",
      timestamp: "2024-01-07 08:45:10",
      user: "admin@fashion.com",
      action: "User Creation",
      resource: "User Management",
      details: "Created new user account for jane.doe@example.com",
      status: "success",
      ip: "192.168.1.100",
    },
  ];

  const getActionIcon = (action: string) => {
    const icons: Record<string, React.ReactNode> = {
      Login: <LoginOutlined />,
      Logout: <LogoutOutlined />,
      "Product Update": <EditOutlined />,
      "Order Status Change": <ShoppingCartOutlined />,
      "Failed Login": <SafetyOutlined />,
      "User Creation": <UserOutlined />,
      "Settings Change": <SettingOutlined />,
      Delete: <DeleteOutlined />,
    };
    return icons[action] || <SettingOutlined />;
  };

  const getStatusColor = (status: string) => {
    return status === "success"
      ? "green"
      : status === "failed"
      ? "red"
      : "orange";
  };

  const columns = [
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      sorter: true,
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (user: string) => (
        <div className="flex items-center space-x-2">
          <UserOutlined />
          <span>{user}</span>
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (action: string) => (
        <div className="flex items-center space-x-2">
          {getActionIcon(action)}
          <span>{action}</span>
        </div>
      ),
    },
    {
      title: "Resource",
      dataIndex: "resource",
      key: "resource",
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "IP Address",
      dataIndex: "ip",
      key: "ip",
      render: (ip: string) => <code className="text-sm">{ip}</code>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-0">
            Audit Logs
          </Title>
          <p className="text-gray-600">
            Monitor system activity and security events
          </p>
        </div>
        <Button type="primary" icon={<DownloadOutlined />} size="large">
          Export Logs
        </Button>
      </div>

      {/* Quick Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-blue-600">1,247</div>
            <div className="text-gray-600">Total Events</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-green-600">1,198</div>
            <div className="text-gray-600">Successful Actions</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-red-600">49</div>
            <div className="text-gray-600">Failed Attempts</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-purple-600">34</div>
            <div className="text-gray-600">Unique Users</div>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4 items-center">
          <Input
            placeholder="Search logs..."
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
            allowClear
          />
          <Select placeholder="Filter by action" style={{ width: 150 }}>
            <Option value="">All Actions</Option>
            <Option value="login">Login</Option>
            <Option value="logout">Logout</Option>
            <Option value="create">Create</Option>
            <Option value="update">Update</Option>
            <Option value="delete">Delete</Option>
          </Select>
          <Select placeholder="Filter by status" style={{ width: 150 }}>
            <Option value="">All Status</Option>
            <Option value="success">Success</Option>
            <Option value="failed">Failed</Option>
            <Option value="warning">Warning</Option>
          </Select>
          <RangePicker placeholder={["Start Date", "End Date"]} />
          <Button>Apply Filters</Button>
        </div>
      </Card>

      {/* Audit Logs Table */}
      <Card title="Activity Log">
        <Table
          columns={columns}
          dataSource={mockLogs}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} events`,
          }}
        />
      </Card>

      {/* Security Alerts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Recent Security Events" extra={<SafetyOutlined />}>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                <span className="text-red-800">
                  Failed login attempts detected
                </span>
                <Tag color="red">HIGH</Tag>
              </div>
              <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                <span className="text-yellow-800">Unusual admin activity</span>
                <Tag color="orange">MEDIUM</Tag>
              </div>
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <span className="text-blue-800">New IP address login</span>
                <Tag color="blue">INFO</Tag>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Top Activities" extra={<SettingOutlined />}>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>User logins</span>
                <span className="font-semibold">342</span>
              </div>
              <div className="flex justify-between">
                <span>Product updates</span>
                <span className="font-semibold">156</span>
              </div>
              <div className="flex justify-between">
                <span>Order changes</span>
                <span className="font-semibold">89</span>
              </div>
              <div className="flex justify-between">
                <span>User management</span>
                <span className="font-semibold">45</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AuditLogs;
