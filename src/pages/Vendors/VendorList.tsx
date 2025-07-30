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
  Modal,
  Form,
  Switch,
  message,
  Statistic,
  Progress,
  Avatar,
  Tooltip,
  Rate,
  Divider,
  List,
  Typography,
  InputNumber,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  TeamOutlined,
  DollarOutlined,
  ShoppingOutlined,
  PercentageOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  StarOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  TrophyOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

interface Vendor {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  status: 'active' | 'pending' | 'suspended' | 'rejected';
  commissionRate: number;
  totalSales: number;
  totalCommission: number;
  productsCount: number;
  ordersCount: number;
  rating: number;
  reviewCount: number;
  joinedDate: string;
  lastActiveDate: string;
  paymentMethod: string;
  taxId: string;
  businessType: string;
  logo?: string;
  description: string;
  categories: string[];
  performance: {
    monthlyGrowth: number;
    customerSatisfaction: number;
    responseTime: number;
    returnRate: number;
  };
}

const VendorList: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // Mock data
    const mockVendors: Vendor[] = [
      {
        id: 'vendor_001',
        companyName: 'Fashion Forward LLC',
        contactPerson: 'Sarah Mitchell',
        email: 'sarah@fashionforward.com',
        phone: '+1-555-0101',
        address: {
          street: '123 Fashion Avenue',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
        },
        status: 'active',
        commissionRate: 15,
        totalSales: 125430.50,
        totalCommission: 18814.58,
        productsCount: 45,
        ordersCount: 234,
        rating: 4.7,
        reviewCount: 89,
        joinedDate: '2023-03-15T00:00:00Z',
        lastActiveDate: '2024-01-07T10:30:00Z',
        paymentMethod: 'Bank Transfer',
        taxId: 'TX123456789',
        businessType: 'LLC',
        logo: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=100',
        description: 'Premium fashion retailer specializing in contemporary women\'s clothing and accessories.',
        categories: ['Women\'s Fashion', 'Accessories'],
        performance: {
          monthlyGrowth: 12.5,
          customerSatisfaction: 92,
          responseTime: 2.3,
          returnRate: 3.2,
        },
      },
      {
        id: 'vendor_002',
        companyName: 'Urban Styles Co.',
        contactPerson: 'Mike Chen',
        email: 'mike@urbanstyles.com',
        phone: '+1-555-0102',
        address: {
          street: '456 Urban Street',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA',
        },
        status: 'active',
        commissionRate: 12,
        totalSales: 89650.25,
        totalCommission: 10758.03,
        productsCount: 38,
        ordersCount: 156,
        rating: 4.3,
        reviewCount: 45,
        joinedDate: '2023-06-20T00:00:00Z',
        lastActiveDate: '2024-01-06T16:45:00Z',
        paymentMethod: 'PayPal',
        taxId: 'TX987654321',
        businessType: 'Corporation',
        description: 'Trendy streetwear and urban fashion for young professionals.',
        categories: ['Men\'s Fashion', 'Streetwear'],
        performance: {
          monthlyGrowth: 8.3,
          customerSatisfaction: 87,
          responseTime: 3.1,
          returnRate: 4.8,
        },
      },
      {
        id: 'vendor_003',
        companyName: 'Eco Threads',
        contactPerson: 'Emma Green',
        email: 'emma@ecothreads.com',
        phone: '+1-555-0103',
        address: {
          street: '789 Green Lane',
          city: 'Portland',
          state: 'OR',
          zipCode: '97201',
          country: 'USA',
        },
        status: 'pending',
        commissionRate: 18,
        totalSales: 0,
        totalCommission: 0,
        productsCount: 0,
        ordersCount: 0,
        rating: 0,
        reviewCount: 0,
        joinedDate: '2024-01-01T00:00:00Z',
        lastActiveDate: '2024-01-07T08:00:00Z',
        paymentMethod: 'Bank Transfer',
        taxId: 'TX555666777',
        businessType: 'LLC',
        description: 'Sustainable and eco-friendly fashion brand focused on organic materials.',
        categories: ['Sustainable Fashion'],
        performance: {
          monthlyGrowth: 0,
          customerSatisfaction: 0,
          responseTime: 0,
          returnRate: 0,
        },
      },
    ];

    setVendors(mockVendors);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'green',
      pending: 'orange',
      suspended: 'red',
      rejected: 'volcano',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      active: <CheckCircleOutlined />,
      pending: <CloseCircleOutlined />,
      suspended: <CloseCircleOutlined />,
      rejected: <CloseCircleOutlined />,
    };
    return icons[status as keyof typeof icons] || <CloseCircleOutlined />;
  };

  const handleCreate = () => {
    setEditingVendor(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    form.setFieldsValue(vendor);
    setModalVisible(true);
  };

  const handleSave = async (values: any) => {
    try {
      const vendorData: Vendor = {
        id: editingVendor?.id || `vendor_${Date.now()}`,
        ...values,
        totalSales: editingVendor?.totalSales || 0,
        totalCommission: editingVendor?.totalCommission || 0,
        productsCount: editingVendor?.productsCount || 0,
        ordersCount: editingVendor?.ordersCount || 0,
        rating: editingVendor?.rating || 0,
        reviewCount: editingVendor?.reviewCount || 0,
        joinedDate: editingVendor?.joinedDate || new Date().toISOString(),
        lastActiveDate: new Date().toISOString(),
        performance: editingVendor?.performance || {
          monthlyGrowth: 0,
          customerSatisfaction: 0,
          responseTime: 0,
          returnRate: 0,
        },
      };

      if (editingVendor) {
        setVendors(vendors.map(v => v.id === editingVendor.id ? vendorData : v));
        message.success('Vendor updated successfully');
      } else {
        setVendors([vendorData, ...vendors]);
        message.success('Vendor created successfully');
      }

      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save vendor');
    }
  };

  const handleDelete = (vendorId: string) => {
    Modal.confirm({
      title: 'Delete Vendor',
      content: 'Are you sure you want to delete this vendor?',
      onOk: () => {
        setVendors(vendors.filter(v => v.id !== vendorId));
        message.success('Vendor deleted successfully');
      },
    });
  };

  const handleApprove = (vendor: Vendor) => {
    setVendors(vendors.map(v => 
      v.id === vendor.id ? { ...v, status: 'active' } : v
    ));
    message.success('Vendor approved successfully');
  };

  const handleReject = (vendor: Vendor) => {
    setVendors(vendors.map(v => 
      v.id === vendor.id ? { ...v, status: 'rejected' } : v
    ));
    message.success('Vendor rejected');
  };

  const showVendorDetails = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setDetailsVisible(true);
  };

  const columns = [
    {
      title: 'Vendor',
      key: 'vendor',
      render: (record: Vendor) => (
        <div className="flex items-center space-x-3">
          <Avatar
            size={60}
            src={record.logo}
            icon={<TeamOutlined />}
            className="border-2 border-gray-200"
          />
          <div>
            <div className="font-medium text-gray-900">{record.companyName}</div>
            <div className="text-sm text-gray-600">{record.contactPerson}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
            <div className="flex items-center space-x-2 mt-1">
              <Rate disabled defaultValue={record.rating} size="small" />
              <span className="text-xs text-gray-500">({record.reviewCount})</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Categories',
      dataIndex: 'categories',
      key: 'categories',
      render: (categories: string[]) => (
        <div className="flex flex-wrap gap-1">
          {categories.map(cat => (
            <Tag key={cat} size="small">{cat}</Tag>
          ))}
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
      title: 'Performance',
      key: 'performance',
      render: (record: Vendor) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">
            ${record.totalSales.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">sales</div>
          <div className="text-sm text-blue-600">
            {record.commissionRate}% commission
          </div>
          <div className="text-xs text-gray-500">
            {record.productsCount} products
          </div>
        </div>
      ),
    },
    {
      title: 'Commission',
      key: 'commission',
      render: (record: Vendor) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-600">
            ${record.totalCommission.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">earned</div>
        </div>
      ),
    },
    {
      title: 'Joined',
      dataIndex: 'joinedDate',
      key: 'joinedDate',
      render: (date: string) => (
        <div className="text-sm">
          {new Date(date).toLocaleDateString()}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Vendor) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => showVendorDetails(record)}
            />
          </Tooltip>
          {record.status === 'pending' && (
            <>
              <Tooltip title="Approve">
                <Button
                  type="text"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleApprove(record)}
                  className="text-green-600"
                />
              </Tooltip>
              <Tooltip title="Reject">
                <Button
                  type="text"
                  icon={<CloseCircleOutlined />}
                  onClick={() => handleReject(record)}
                  className="text-red-600"
                />
              </Tooltip>
            </>
          )}
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
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

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.companyName.toLowerCase().includes(searchText.toLowerCase()) ||
                         vendor.contactPerson.toLowerCase().includes(searchText.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || vendor.categories.includes(categoryFilter);
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Calculate stats
  const totalVendors = vendors.length;
  const activeVendors = vendors.filter(v => v.status === 'active').length;
  const pendingVendors = vendors.filter(v => v.status === 'pending').length;
  const totalCommissionPaid = vendors.reduce((sum, v) => sum + v.totalCommission, 0);
  const totalPlatformSales = vendors.reduce((sum, v) => sum + v.totalSales, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-0">Vendor Management</Title>
          <p className="text-gray-600">Manage your marketplace vendors and partnerships</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} size="large">
          Add Vendor
        </Button>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Vendors"
              value={totalVendors}
              valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Active Vendors"
              value={activeVendors}
              valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<CheckCircleOutlined />}
              suffix={
                pendingVendors > 0 && (
                  <div className="text-sm text-orange-600 mt-1">
                    {pendingVendors} pending approval
                  </div>
                )
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Platform Sales"
              value={totalPlatformSales}
              precision={0}
              valueStyle={{ color: '#f5a623', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Commission Paid"
              value={totalCommissionPaid}
              precision={0}
              valueStyle={{ color: '#722ed1', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<PercentageOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Top Performers */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Top Performing Vendors" extra={<TrophyOutlined />}>
            <List
              dataSource={vendors.filter(v => v.status === 'active').sort((a, b) => b.totalSales - a.totalSales).slice(0, 5)}
              renderItem={(vendor, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 text-yellow-800 rounded-full font-bold">
                          {index + 1}
                        </div>
                        <Avatar src={vendor.logo} icon={<TeamOutlined />} />
                      </div>
                    }
                    title={vendor.companyName}
                    description={`$${vendor.totalSales.toLocaleString()} in sales • ${vendor.commissionRate}% commission`}
                  />
                  <div className="text-right">
                    <div className="text-green-600 font-semibold">
                      ${vendor.totalCommission.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">commission earned</div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Performance Metrics">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vendors.filter(v => v.status === 'active').map(v => ({
                name: v.companyName.substring(0, 10),
                sales: v.totalSales,
                commission: v.totalCommission,
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="sales" fill="#8884d8" />
                <Bar dataKey="commission" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4 items-center">
          <Search
            placeholder="Search vendors..."
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
            <Option value="pending">Pending</Option>
            <Option value="suspended">Suspended</Option>
            <Option value="rejected">Rejected</Option>
          </Select>
          <Select
            style={{ width: 200 }}
            value={categoryFilter}
            onChange={setCategoryFilter}
            placeholder="Filter by category"
          >
            <Option value="all">All Categories</Option>
            <Option value="Women's Fashion">Women's Fashion</Option>
            <Option value="Men's Fashion">Men's Fashion</Option>
            <Option value="Accessories">Accessories</Option>
            <Option value="Streetwear">Streetwear</Option>
            <Option value="Sustainable Fashion">Sustainable Fashion</Option>
          </Select>
        </div>
      </Card>

      {/* Vendors Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredVendors}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} vendors`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Create/Edit Vendor Modal */}
      <Modal
        title={editingVendor ? 'Edit Vendor' : 'Add Vendor'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
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
                name="companyName"
                label="Company Name"
                rules={[{ required: true, message: 'Please enter company name' }]}
              >
                <Input placeholder="Enter company name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="contactPerson"
                label="Contact Person"
                rules={[{ required: true, message: 'Please enter contact person' }]}
              >
                <Input placeholder="Enter contact person name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter valid email' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="vendor@company.com" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="+1-555-0123" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Brief description of the vendor business" />
          </Form.Item>

          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item name="businessType" label="Business Type">
                <Select placeholder="Select business type">
                  <Option value="LLC">LLC</Option>
                  <Option value="Corporation">Corporation</Option>
                  <Option value="Partnership">Partnership</Option>
                  <Option value="Sole Proprietorship">Sole Proprietorship</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="commissionRate" label="Commission Rate (%)">
                <InputNumber
                  min={0}
                  max={50}
                  step={0.1}
                  style={{ width: '100%' }}
                  placeholder="15.0"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="categories" label="Categories">
            <Select mode="multiple" placeholder="Select business categories">
              <Option value="Women's Fashion">Women's Fashion</Option>
              <Option value="Men's Fashion">Men's Fashion</Option>
              <Option value="Accessories">Accessories</Option>
              <Option value="Streetwear">Streetwear</Option>
              <Option value="Sustainable Fashion">Sustainable Fashion</Option>
              <Option value="Luxury">Luxury</Option>
            </Select>
          </Form.Item>

          <Form.Item name="status" label="Status" initialValue="pending">
            <Select>
              <Option value="active">Active</Option>
              <Option value="pending">Pending</Option>
              <Option value="suspended">Suspended</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
          </Form.Item>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingVendor ? 'Update Vendor' : 'Add Vendor'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Vendor Details Modal */}
      <Modal
        title={`Vendor Details - ${selectedVendor?.companyName}`}
        open={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        footer={[<Button key="close" onClick={() => setDetailsVisible(false)}>Close</Button>]}
        width={800}
      >
        {selectedVendor && (
          <div className="space-y-6">
            <div className="text-center border-b pb-4">
              <Avatar
                size={100}
                src={selectedVendor.logo}
                icon={<TeamOutlined />}
                className="mb-4"
              />
              <h2 className="text-xl font-bold">{selectedVendor.companyName}</h2>
              <p className="text-gray-600">{selectedVendor.description}</p>
              <Tag color={getStatusColor(selectedVendor.status)} className="mt-2">
                {selectedVendor.status.toUpperCase()}
              </Tag>
            </div>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic title="Total Sales" value={selectedVendor.totalSales} prefix="$" precision={2} />
              </Col>
              <Col span={12}>
                <Statistic title="Commission Earned" value={selectedVendor.totalCommission} prefix="$" precision={2} />
              </Col>
              <Col span={12}>
                <Statistic title="Products" value={selectedVendor.productsCount} />
              </Col>
              <Col span={12}>
                <Statistic title="Orders" value={selectedVendor.ordersCount} />
              </Col>
            </Row>

            <Divider />

            <div>
              <h3 className="text-lg font-medium mb-3">Performance Metrics</h3>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedVendor.performance.monthlyGrowth.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Monthly Growth</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedVendor.performance.customerSatisfaction}%
                    </div>
                    <div className="text-sm text-gray-600">Customer Satisfaction</div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VendorList;
