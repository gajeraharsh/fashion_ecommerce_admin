import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Card,
  Row,
  Col,
  Statistic,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Switch,
  message,
  Progress,
  Tooltip,
  Badge,
  Drawer,
  Descriptions,
  List,
  Avatar,
  Timeline,
  Alert,
  Radio,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  GiftOutlined,
  PercentageOutlined,
  DollarOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  CopyOutlined,
  ShareAltOutlined,
  BarChartOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  FileExcelOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setCoupons, updateCouponStatus, deleteCoupon } from '../../store/slices/couponSlice';
import dayjs, { Dayjs } from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'free_shipping' | 'buy_x_get_y';
  value: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
  excludedProducts?: string[];
  excludedCategories?: string[];
  usageLimit?: number;
  usageLimitPerCustomer?: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'expired' | 'draft';
  customerEligibility: 'all' | 'new_customers' | 'returning_customers' | 'vip_customers';
  stackable: boolean;
  oneTimeUse: boolean;
  autoApply: boolean;
  createdAt: string;
  updatedAt: string;
  analytics: {
    totalUsage: number;
    totalRevenue: number;
    totalDiscount: number;
    averageOrderValue: number;
    conversionRate: number;
  };
  rules?: {
    buyXGetY?: {
      buyQuantity: number;
      getQuantity: number;
      getProductId?: string;
    };
    minimumQuantity?: number;
    firstTimeCustomers?: boolean;
  };
}

interface CouponUsage {
  id: string;
  couponId: string;
  couponCode: string;
  orderId: string;
  userId: string;
  customerName: string;
  discountAmount: number;
  orderAmount: number;
  usedAt: string;
}

const CouponList: React.FC = () => {
  const dispatch = useDispatch();
  const { coupons, couponUsage, loading } = useSelector((state: RootState) => state.coupons);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockCoupons: Coupon[] = [
      {
        id: 'coupon_001',
        code: 'WELCOME20',
        name: 'Welcome Discount',
        description: '20% off for new customers',
        type: 'percentage',
        value: 20,
        minimumOrderAmount: 50,
        maximumDiscountAmount: 100,
        usageLimit: 1000,
        usageLimitPerCustomer: 1,
        usedCount: 245,
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-12-31T23:59:59Z',
        status: 'active',
        customerEligibility: 'new_customers',
        stackable: false,
        oneTimeUse: true,
        autoApply: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-07T10:00:00Z',
        analytics: {
          totalUsage: 245,
          totalRevenue: 12250,
          totalDiscount: 3675,
          averageOrderValue: 85.50,
          conversionRate: 24.5,
        },
      },
      {
        id: 'coupon_002',
        code: 'SAVE50',
        name: 'Fixed Amount Discount',
        description: '$50 off orders over $200',
        type: 'fixed_amount',
        value: 50,
        minimumOrderAmount: 200,
        usageLimit: 500,
        usageLimitPerCustomer: 3,
        usedCount: 89,
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-03-31T23:59:59Z',
        status: 'active',
        customerEligibility: 'all',
        stackable: true,
        oneTimeUse: false,
        autoApply: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-06T15:30:00Z',
        analytics: {
          totalUsage: 89,
          totalRevenue: 22250,
          totalDiscount: 4450,
          averageOrderValue: 250.00,
          conversionRate: 17.8,
        },
      },
      {
        id: 'coupon_003',
        code: 'FREESHIP',
        name: 'Free Shipping',
        description: 'Free shipping on all orders',
        type: 'free_shipping',
        value: 0,
        minimumOrderAmount: 75,
        usedCount: 567,
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-12-31T23:59:59Z',
        status: 'active',
        customerEligibility: 'all',
        stackable: true,
        oneTimeUse: false,
        autoApply: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-07T09:00:00Z',
        analytics: {
          totalUsage: 567,
          totalRevenue: 85050,
          totalDiscount: 8505,
          averageOrderValue: 150.00,
          conversionRate: 56.7,
        },
      },
      {
        id: 'coupon_004',
        code: 'EXPIRED10',
        name: 'Expired Discount',
        description: '10% off - promotion ended',
        type: 'percentage',
        value: 10,
        usedCount: 45,
        startDate: '2023-12-01T00:00:00Z',
        endDate: '2023-12-31T23:59:59Z',
        status: 'expired',
        customerEligibility: 'all',
        stackable: false,
        oneTimeUse: false,
        autoApply: false,
        createdAt: '2023-12-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        analytics: {
          totalUsage: 45,
          totalRevenue: 4500,
          totalDiscount: 450,
          averageOrderValue: 100.00,
          conversionRate: 4.5,
        },
      },
    ];

    const mockCouponUsage: CouponUsage[] = [
      {
        id: 'usage_001',
        couponId: 'coupon_001',
        couponCode: 'WELCOME20',
        orderId: 'ORD-001',
        userId: 'user1',
        customerName: 'John Doe',
        discountAmount: 59.99,
        orderAmount: 299.99,
        usedAt: '2024-01-07T10:30:00Z',
      },
      {
        id: 'usage_002',
        couponId: 'coupon_002',
        couponCode: 'SAVE50',
        orderId: 'ORD-002',
        userId: 'user2',
        customerName: 'Jane Smith',
        discountAmount: 50.00,
        orderAmount: 450.00,
        usedAt: '2024-01-06T15:45:00Z',
      },
    ];

    dispatch(setCoupons({ coupons: mockCoupons, couponUsage: mockCouponUsage }));
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'green',
      inactive: 'orange',
      expired: 'red',
      draft: 'gray',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      active: <CheckCircleOutlined />,
      inactive: <ExclamationCircleOutlined />,
      expired: <CloseCircleOutlined />,
      draft: <EditOutlined />,
    };
    return icons[status as keyof typeof icons] || <ExclamationCircleOutlined />;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      percentage: <PercentageOutlined />,
      fixed_amount: <DollarOutlined />,
      free_shipping: <GiftOutlined />,
      buy_x_get_y: <ShoppingCartOutlined />,
    };
    return icons[type as keyof typeof icons] || <GiftOutlined />;
  };

  const handleCreateCoupon = async (values: any) => {
    try {
      const newCoupon: Coupon = {
        id: `coupon_${Date.now()}`,
        ...values,
        code: values.code.toUpperCase(),
        usedCount: 0,
        status: values.status || 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        analytics: {
          totalUsage: 0,
          totalRevenue: 0,
          totalDiscount: 0,
          averageOrderValue: 0,
          conversionRate: 0,
        },
      };

      // dispatch(addCoupon(newCoupon));
      message.success('Coupon created successfully');
      setCreateModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to create coupon');
    }
  };

  const handleToggleStatus = (coupon: Coupon) => {
    const newStatus = coupon.status === 'active' ? 'inactive' : 'active';
    dispatch(updateCouponStatus({ couponId: coupon.id, status: newStatus }));
    message.success(`Coupon ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
  };

  const handleDelete = (couponId: string) => {
    Modal.confirm({
      title: 'Delete Coupon',
      content: 'Are you sure you want to delete this coupon? This action cannot be undone.',
      onOk: () => {
        dispatch(deleteCoupon(couponId));
        message.success('Coupon deleted successfully');
      },
    });
  };

  const handleCopyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    message.success('Coupon code copied to clipboard');
  };

  const showCouponDetails = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setDetailsVisible(true);
  };

  const columns = [
    {
      title: 'Coupon',
      key: 'coupon',
      render: (record: Coupon) => (
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
            {getTypeIcon(record.type)}
          </div>
          <div>
            <div className="font-medium flex items-center space-x-2">
              <span>{record.code}</span>
              <Button
                type="text"
                size="small"
                icon={<CopyOutlined />}
                onClick={() => handleCopyCouponCode(record.code)}
              />
            </div>
            <div className="text-sm text-gray-600">{record.name}</div>
            <div className="text-xs text-gray-500">{record.description}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Type & Value',
      key: 'typeValue',
      render: (record: Coupon) => (
        <div className="text-center">
          <div className="font-semibold text-blue-600">
            {record.type === 'percentage' ? `${record.value}%` :
             record.type === 'fixed_amount' ? `$${record.value}` :
             record.type === 'free_shipping' ? 'Free Ship' :
             'Buy X Get Y'}
          </div>
          <div className="text-xs text-gray-500 capitalize">
            {record.type.replace('_', ' ')}
          </div>
        </div>
      ),
    },
    {
      title: 'Usage',
      key: 'usage',
      render: (record: Coupon) => (
        <div className="text-center">
          <div className="font-semibold">{record.usedCount}</div>
          {record.usageLimit && (
            <Progress
              percent={(record.usedCount / record.usageLimit) * 100}
              size="small"
              showInfo={false}
              className="mt-1"
            />
          )}
          <div className="text-xs text-gray-500">
            {record.usageLimit ? `of ${record.usageLimit}` : 'Unlimited'}
          </div>
        </div>
      ),
    },
    {
      title: 'Revenue Impact',
      key: 'revenue',
      render: (record: Coupon) => (
        <div className="text-right">
          <div className="font-semibold text-green-600">
            ${record.analytics.totalRevenue.toLocaleString()}
          </div>
          <div className="text-sm text-red-600">
            -${record.analytics.totalDiscount.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">
            {record.analytics.conversionRate.toFixed(1)}% conv.
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Valid Period',
      key: 'period',
      render: (record: Coupon) => (
        <div className="text-sm">
          <div>{new Date(record.startDate).toLocaleDateString()}</div>
          <div className="text-gray-500">to</div>
          <div>{new Date(record.endDate).toLocaleDateString()}</div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Coupon) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => showCouponDetails(record)}
            />
          </Tooltip>
          <Tooltip title={record.status === 'active' ? 'Deactivate' : 'Activate'}>
            <Button
              type="text"
              icon={record.status === 'active' ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
              onClick={() => handleToggleStatus(record)}
              disabled={record.status === 'expired'}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingCoupon(record);
                form.setFieldsValue({
                  ...record,
                  period: [dayjs(record.startDate), dayjs(record.endDate)],
                });
                setCreateModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
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

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchText.toLowerCase()) ||
                         coupon.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         coupon.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || coupon.status === statusFilter;
    const matchesType = typeFilter === 'all' || coupon.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate stats
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter(c => c.status === 'active').length;
  const totalDiscountGiven = coupons.reduce((sum, c) => sum + c.analytics.totalDiscount, 0);
  const totalRevenueGenerated = coupons.reduce((sum, c) => sum + c.analytics.totalRevenue, 0);

  // Chart data
  const usageData = [
    { month: 'Jan', usage: 245, revenue: 12250 },
    { month: 'Feb', usage: 189, revenue: 9450 },
    { month: 'Mar', usage: 267, revenue: 13350 },
    { month: 'Apr', usage: 312, revenue: 15600 },
    { month: 'May', usage: 298, revenue: 14900 },
    { month: 'Jun', usage: 356, revenue: 17800 },
  ];

  const typeDistribution = [
    { name: 'Percentage', value: 40, color: '#8884d8' },
    { name: 'Fixed Amount', value: 30, color: '#82ca9d' },
    { name: 'Free Shipping', value: 25, color: '#ffc658' },
    { name: 'Buy X Get Y', value: 5, color: '#ff7c7c' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Coupons & Discounts</h1>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingCoupon(null);
              form.resetFields();
              setCreateModalVisible(true);
            }}
            size="large"
          >
            Create Coupon
          </Button>
          <Button icon={<FileExcelOutlined />}>Export</Button>
        </Space>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Coupons"
              value={totalCoupons}
              valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<GiftOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Active Coupons"
              value={activeCoupons}
              valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<CheckCircleOutlined />}
              suffix={
                <div className="text-sm text-green-600 mt-1">
                  {((activeCoupons / totalCoupons) * 100).toFixed(1)}% active
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Revenue Generated"
              value={totalRevenueGenerated}
              precision={0}
              valueStyle={{ color: '#f5a623', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Discounts"
              value={totalDiscountGiven}
              precision={0}
              valueStyle={{ color: '#722ed1', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<PercentageOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Coupon Usage Trends">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Area
                  type="monotone"
                  dataKey="usage"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                  name="Usage Count"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Coupon Type Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4 items-center">
          <Search
            placeholder="Search coupons by code, name..."
            allowClear
            style={{ width: 300 }}
            onSearch={setSearchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            style={{ width: 150 }}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filter by status"
          >
            <Option value="all">All Status</Option>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
            <Option value="expired">Expired</Option>
            <Option value="draft">Draft</Option>
          </Select>
          <Select
            style={{ width: 150 }}
            value={typeFilter}
            onChange={setTypeFilter}
            placeholder="Filter by type"
          >
            <Option value="all">All Types</Option>
            <Option value="percentage">Percentage</Option>
            <Option value="fixed_amount">Fixed Amount</Option>
            <Option value="free_shipping">Free Shipping</Option>
            <Option value="buy_x_get_y">Buy X Get Y</Option>
          </Select>
          <Button
            icon={<FilterOutlined />}
            onClick={() => {
              setSearchText('');
              setStatusFilter('all');
              setTypeFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Coupons Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredCoupons}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} coupons`,
          }}
          scroll={{ x: 1200 }}
          className="overflow-x-auto"
        />
      </Card>

      {/* Coupon Details Drawer */}
      <Drawer
        title={selectedCoupon ? `${selectedCoupon.code} - Details` : 'Coupon Details'}
        open={detailsVisible}
        onClose={() => setDetailsVisible(false)}
        width={600}
      >
        {selectedCoupon && (
          <div className="space-y-6">
            {/* Coupon Overview */}
            <div className="text-center border-b pb-4">
              <div className="text-3xl mb-2">
                {getTypeIcon(selectedCoupon.type)}
              </div>
              <h2 className="text-xl font-bold">{selectedCoupon.code}</h2>
              <p className="text-gray-600">{selectedCoupon.name}</p>
              <Tag color={getStatusColor(selectedCoupon.status)} className="mt-2">
                {selectedCoupon.status.toUpperCase()}
              </Tag>
            </div>

            {/* Basic Information */}
            <Descriptions title="Basic Information" column={1}>
              <Descriptions.Item label="Description">{selectedCoupon.description}</Descriptions.Item>
              <Descriptions.Item label="Type">
                {selectedCoupon.type.replace('_', ' ').toUpperCase()}
              </Descriptions.Item>
              <Descriptions.Item label="Value">
                {selectedCoupon.type === 'percentage' ? `${selectedCoupon.value}%` :
                 selectedCoupon.type === 'fixed_amount' ? `$${selectedCoupon.value}` :
                 selectedCoupon.type === 'free_shipping' ? 'Free Shipping' :
                 'Buy X Get Y'}
              </Descriptions.Item>
              <Descriptions.Item label="Valid Period">
                {new Date(selectedCoupon.startDate).toLocaleDateString()} - {new Date(selectedCoupon.endDate).toLocaleDateString()}
              </Descriptions.Item>
            </Descriptions>

            {/* Usage Statistics */}
            <div>
              <h3 className="text-lg font-medium mb-3">Usage Statistics</h3>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic title="Total Usage" value={selectedCoupon.analytics.totalUsage} />
                </Col>
                <Col span={12}>
                  <Statistic title="Revenue Generated" value={selectedCoupon.analytics.totalRevenue} prefix="$" />
                </Col>
                <Col span={12}>
                  <Statistic title="Total Discount" value={selectedCoupon.analytics.totalDiscount} prefix="$" />
                </Col>
                <Col span={12}>
                  <Statistic title="Avg Order Value" value={selectedCoupon.analytics.averageOrderValue} prefix="$" precision={2} />
                </Col>
              </Row>
              
              {selectedCoupon.usageLimit && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Usage Progress</span>
                    <span>{selectedCoupon.usedCount} / {selectedCoupon.usageLimit}</span>
                  </div>
                  <Progress
                    percent={(selectedCoupon.usedCount / selectedCoupon.usageLimit) * 100}
                    status={selectedCoupon.usedCount >= selectedCoupon.usageLimit ? 'exception' : 'normal'}
                  />
                </div>
              )}
            </div>

            {/* Conditions */}
            <Descriptions title="Conditions & Rules" column={1}>
              {selectedCoupon.minimumOrderAmount && (
                <Descriptions.Item label="Minimum Order">
                  ${selectedCoupon.minimumOrderAmount}
                </Descriptions.Item>
              )}
              {selectedCoupon.maximumDiscountAmount && (
                <Descriptions.Item label="Maximum Discount">
                  ${selectedCoupon.maximumDiscountAmount}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Customer Eligibility">
                {selectedCoupon.customerEligibility.replace('_', ' ').toUpperCase()}
              </Descriptions.Item>
              <Descriptions.Item label="Stackable">
                {selectedCoupon.stackable ? 'Yes' : 'No'}
              </Descriptions.Item>
              <Descriptions.Item label="One Time Use">
                {selectedCoupon.oneTimeUse ? 'Yes' : 'No'}
              </Descriptions.Item>
              <Descriptions.Item label="Auto Apply">
                {selectedCoupon.autoApply ? 'Yes' : 'No'}
              </Descriptions.Item>
            </Descriptions>

            {/* Recent Usage */}
            <div>
              <h3 className="text-lg font-medium mb-3">Recent Usage</h3>
              <List
                size="small"
                dataSource={couponUsage.filter(usage => usage.couponId === selectedCoupon.id).slice(0, 5)}
                renderItem={usage => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<TeamOutlined />} />}
                      title={`${usage.customerName} - Order ${usage.orderId}`}
                      description={`Saved $${usage.discountAmount} on $${usage.orderAmount} order • ${new Date(usage.usedAt).toLocaleDateString()}`}
                    />
                  </List.Item>
                )}
                locale={{ emptyText: 'No usage history yet' }}
              />
            </div>
          </div>
        )}
      </Drawer>

      {/* Create/Edit Coupon Modal */}
      <Modal
        title={editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateCoupon}
          className="mt-4"
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="code"
                label="Coupon Code"
                rules={[{ required: true, message: 'Please enter coupon code' }]}
              >
                <Input placeholder="e.g., SAVE20" style={{ textTransform: 'uppercase' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label="Coupon Name"
                rules={[{ required: true, message: 'Please enter coupon name' }]}
              >
                <Input placeholder="e.g., Summer Sale" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Description">
            <TextArea rows={2} placeholder="Brief description of the coupon" />
          </Form.Item>

          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="type"
                label="Discount Type"
                rules={[{ required: true, message: 'Please select discount type' }]}
              >
                <Select placeholder="Select discount type">
                  <Option value="percentage">Percentage Discount</Option>
                  <Option value="fixed_amount">Fixed Amount Discount</Option>
                  <Option value="free_shipping">Free Shipping</Option>
                  <Option value="buy_x_get_y">Buy X Get Y</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="value"
                label="Discount Value"
                rules={[{ required: true, message: 'Please enter discount value' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="Enter value"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item name="minimumOrderAmount" label="Minimum Order Amount">
                <InputNumber
                  min={0}
                  precision={2}
                  prefix="$"
                  style={{ width: '100%' }}
                  placeholder="0.00"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="maximumDiscountAmount" label="Maximum Discount Amount">
                <InputNumber
                  min={0}
                  precision={2}
                  prefix="$"
                  style={{ width: '100%' }}
                  placeholder="0.00"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="period"
            label="Valid Period"
            rules={[{ required: true, message: 'Please select valid period' }]}
          >
            <RangePicker
              showTime
              style={{ width: '100%' }}
              placeholder={['Start Date', 'End Date']}
            />
          </Form.Item>

          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item name="usageLimit" label="Usage Limit">
                <InputNumber
                  min={1}
                  style={{ width: '100%' }}
                  placeholder="Leave empty for unlimited"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="usageLimitPerCustomer" label="Usage Limit Per Customer">
                <InputNumber
                  min={1}
                  style={{ width: '100%' }}
                  placeholder="Leave empty for unlimited"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="customerEligibility" label="Customer Eligibility">
            <Radio.Group>
              <Radio value="all">All Customers</Radio>
              <Radio value="new_customers">New Customers Only</Radio>
              <Radio value="returning_customers">Returning Customers</Radio>
              <Radio value="vip_customers">VIP Customers</Radio>
            </Radio.Group>
          </Form.Item>

          <Row gutter={[16, 0]}>
            <Col xs={24} sm={8}>
              <Form.Item name="stackable" valuePropName="checked">
                <Switch /> Stackable with other coupons
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="oneTimeUse" valuePropName="checked">
                <Switch /> One-time use per customer
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="autoApply" valuePropName="checked">
                <Switch /> Auto-apply at checkout
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button onClick={() => setCreateModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CouponList;
