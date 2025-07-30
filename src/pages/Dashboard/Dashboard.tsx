import React, { useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Tag,
  Progress,
  List,
  Avatar,
  Button,
  Space,
  Select,
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  DollarOutlined,
  ShoppingOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setStats, setSalesData, setTopProducts, setRecentOrders } from '../../store/slices/dashboardSlice';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { stats, salesData, topProducts, recentOrders } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    // Mock data - replace with actual API calls
    dispatch(setStats({
      totalRevenue: 125430,
      totalOrders: 1234,
      totalUsers: 5678,
      totalProducts: 892,
      revenueGrowth: 12.5,
      orderGrowth: 8.3,
      userGrowth: 15.2,
    }));

    dispatch(setSalesData([
      { date: '2024-01-01', revenue: 4000, orders: 120 },
      { date: '2024-01-02', revenue: 3000, orders: 95 },
      { date: '2024-01-03', revenue: 2000, orders: 80 },
      { date: '2024-01-04', revenue: 2780, orders: 105 },
      { date: '2024-01-05', revenue: 1890, orders: 78 },
      { date: '2024-01-06', revenue: 2390, orders: 98 },
      { date: '2024-01-07', revenue: 3490, orders: 132 },
    ]));

    dispatch(setTopProducts([
      { id: '1', name: 'Designer Dress', sales: 145, revenue: 14500 },
      { id: '2', name: 'Casual Shirt', sales: 120, revenue: 7200 },
      { id: '3', name: 'Leather Jacket', sales: 98, revenue: 19600 },
      { id: '4', name: 'Denim Jeans', sales: 87, revenue: 6960 },
      { id: '5', name: 'Summer Top', sales: 76, revenue: 3040 },
    ]));

    dispatch(setRecentOrders([
      { id: 'ORD-001', customer: 'John Doe', amount: 299, status: 'shipped', date: '2024-01-07' },
      { id: 'ORD-002', customer: 'Jane Smith', amount: 450, status: 'processing', date: '2024-01-07' },
      { id: 'ORD-003', customer: 'Mike Johnson', amount: 199, status: 'delivered', date: '2024-01-06' },
      { id: 'ORD-004', customer: 'Sarah Wilson', amount: 350, status: 'shipped', date: '2024-01-06' },
      { id: 'ORD-005', customer: 'Tom Brown', amount: 150, status: 'pending', date: '2024-01-05' },
    ]));
  }, [dispatch]);

  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <span className="font-medium text-blue-600">{text}</span>,
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `$${amount}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          pending: 'orange',
          processing: 'blue',
          shipped: 'purple',
          delivered: 'green',
        };
        return <Tag color={colors[status as keyof typeof colors]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Button type="link" icon={<EyeOutlined />} size="small">
          View
        </Button>
      ),
    },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <Space>
          <Select defaultValue="7d" style={{ width: 120 }}>
            <Select.Option value="7d">Last 7 days</Select.Option>
            <Select.Option value="30d">Last 30 days</Select.Option>
            <Select.Option value="90d">Last 90 days</Select.Option>
          </Select>
        </Space>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <Statistic
              title="Total Revenue"
              value={stats.totalRevenue}
              precision={2}
              valueStyle={{ color: '#3f8600', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<DollarOutlined />}
              suffix={
                <span className="text-sm text-green-600 ml-2">
                  <ArrowUpOutlined /> {stats.revenueGrowth}%
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <Statistic
              title="Total Orders"
              value={stats.totalOrders}
              valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<ShoppingCartOutlined />}
              suffix={
                <span className="text-sm text-blue-600 ml-2">
                  <ArrowUpOutlined /> {stats.orderGrowth}%
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              valueStyle={{ color: '#722ed1', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<UserOutlined />}
              suffix={
                <span className="text-sm text-purple-600 ml-2">
                  <ArrowUpOutlined /> {stats.userGrowth}%
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <Statistic
              title="Total Products"
              value={stats.totalProducts}
              valueStyle={{ color: '#f5222d', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Sales Overview" className="h-full">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  strokeWidth={3}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Top Products" className="h-full">
            <List
              dataSource={topProducts}
              renderItem={(item, index) => (
                <List.Item className="hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        style={{ 
                          backgroundColor: COLORS[index % COLORS.length],
                          fontWeight: 'bold'
                        }}
                      >
                        {index + 1}
                      </Avatar>
                    }
                    title={<span className="font-medium">{item.name}</span>}
                    description={`${item.sales} sales • $${item.revenue.toLocaleString()}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Orders */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card 
            title="Recent Orders" 
            extra={<Button type="primary">View All Orders</Button>}
          >
            <Table
              columns={orderColumns}
              dataSource={recentOrders}
              rowKey="id"
              pagination={false}
              size="middle"
              className="hover:shadow-sm transition-shadow"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;