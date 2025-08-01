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
  DatePicker,
  message,
  Tooltip,
  Image,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  BarChartOutlined,
  CopyOutlined,
  SettingOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Using modern Tabs API

interface Banner {
  id: string;
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  mobileImageUrl?: string;
  linkUrl: string;
  linkText: string;
  position: 'hero' | 'top' | 'sidebar' | 'footer' | 'popup' | 'category';
  status: 'active' | 'inactive' | 'scheduled' | 'expired';
  priority: number;
  startDate: string;
  endDate: string;
  targetAudience: 'all' | 'new_users' | 'returning_users' | 'vip_users';
  devices: string[];
  locations: string[];
  clicks: number;
  impressions: number;
  conversionRate: number;
  createdAt: string;
  updatedAt: string;
  abTest?: {
    enabled: boolean;
    variantA: {
      imageUrl: string;
      title: string;
      clicks: number;
      impressions: number;
    };
    variantB: {
      imageUrl: string;
      title: string;
      clicks: number;
      impressions: number;
    };
  };
}

const BannerList: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [analyticsVisible, setAnalyticsVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // Mock data
    const mockBanners: Banner[] = [
      {
        id: 'banner_001',
        name: 'Summer Sale 2024',
        title: 'Summer Sale - Up to 70% Off',
        description: 'Limited time summer collection sale',
        imageUrl: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=800',
        mobileImageUrl: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=400',
        linkUrl: '/summer-sale',
        linkText: 'Shop Now',
        position: 'hero',
        status: 'active',
        priority: 1,
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-12-31T23:59:59Z',
        targetAudience: 'all',
        devices: ['desktop', 'mobile', 'tablet'],
        locations: ['US', 'CA', 'UK'],
        clicks: 1245,
        impressions: 25890,
        conversionRate: 4.81,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-07T10:00:00Z',
        abTest: {
          enabled: true,
          variantA: {
            imageUrl: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=800',
            title: 'Summer Sale - Up to 70% Off',
            clicks: 625,
            impressions: 12945,
          },
          variantB: {
            imageUrl: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800',
            title: 'Hot Summer Deals - Save Big!',
            clicks: 620,
            impressions: 12945,
          },
        },
      },
      {
        id: 'banner_002',
        name: 'New Collection',
        title: 'New Arrivals - Fashion Forward',
        description: 'Discover the latest trends in fashion',
        imageUrl: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800',
        linkUrl: '/new-arrivals',
        linkText: 'Explore Collection',
        position: 'top',
        status: 'active',
        priority: 2,
        startDate: '2024-01-05T00:00:00Z',
        endDate: '2024-06-30T23:59:59Z',
        targetAudience: 'new_users',
        devices: ['desktop', 'mobile'],
        locations: ['US', 'CA'],
        clicks: 856,
        impressions: 18654,
        conversionRate: 4.59,
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-01-06T15:30:00Z',
      },
      {
        id: 'banner_003',
        name: 'VIP Members Only',
        title: 'Exclusive VIP Deals',
        description: 'Special offers for VIP members',
        imageUrl: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
        linkUrl: '/vip-deals',
        linkText: 'View Deals',
        position: 'sidebar',
        status: 'inactive',
        priority: 3,
        startDate: '2024-01-10T00:00:00Z',
        endDate: '2024-03-31T23:59:59Z',
        targetAudience: 'vip_users',
        devices: ['desktop'],
        locations: ['US'],
        clicks: 245,
        impressions: 5890,
        conversionRate: 4.16,
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-10T12:00:00Z',
      },
    ];

    setBanners(mockBanners);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'green',
      inactive: 'orange',
      scheduled: 'blue',
      expired: 'red',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getPositionColor = (position: string) => {
    const colors = {
      hero: 'purple',
      top: 'blue',
      sidebar: 'green',
      footer: 'orange',
      popup: 'red',
      category: 'cyan',
    };
    return colors[position as keyof typeof colors] || 'default';
  };

  const handleCreate = () => {
    setEditingBanner(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    form.setFieldsValue({
      ...banner,
      dateRange: [dayjs(banner.startDate), dayjs(banner.endDate)],
    });
    setModalVisible(true);
  };

  const handleSave = async (values: Partial<Banner>) => {
    try {
      const bannerData: Banner = {
        id: editingBanner?.id || `banner_${Date.now()}`,
        ...values,
        startDate: values.dateRange[0].toISOString(),
        endDate: values.dateRange[1].toISOString(),
        clicks: editingBanner?.clicks || 0,
        impressions: editingBanner?.impressions || 0,
        conversionRate: editingBanner?.conversionRate || 0,
        createdAt: editingBanner?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingBanner) {
        setBanners(banners.map(b => b.id === editingBanner.id ? bannerData : b));
        message.success('Banner updated successfully');
      } else {
        setBanners([bannerData, ...banners]);
        message.success('Banner created successfully');
      }

      setModalVisible(false);
      form.resetFields();
    } catch {
      message.error('Failed to save banner');
    }
  };

  const handleDelete = (bannerId: string) => {
    Modal.confirm({
      title: 'Delete Banner',
      content: 'Are you sure you want to delete this banner?',
      onOk: () => {
        setBanners(banners.filter(b => b.id !== bannerId));
        message.success('Banner deleted successfully');
      },
    });
  };

  const handleToggleStatus = (banner: Banner) => {
    const newStatus = banner.status === 'active' ? 'inactive' : 'active';
    setBanners(banners.map(b => 
      b.id === banner.id ? { ...b, status: newStatus } : b
    ));
    message.success(`Banner ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
  };

  const showAnalytics = (banner: Banner) => {
    setSelectedBanner(banner);
    setAnalyticsVisible(true);
  };

  const columns = [
    {
      title: 'Banner',
      key: 'banner',
      render: (record: Banner) => (
        <div className="flex items-center space-x-3">
          <Image
            width={80}
            height={40}
            src={record.imageUrl}
            className="rounded object-cover"
            preview={false}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RUG8G+0Y4Hh0CAIHx8YAGH1AZAjWOOAI1hjjAOOYI1zjmCNA1hjjAOOYI0xjjEOOAI0wrDgA2AEOOAAOhKKbKUVKmcBGvZNfNaE..."
          />
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-sm text-gray-600">{record.title}</div>
            <div className="text-xs text-gray-500">{record.description}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      render: (position: string) => (
        <Tag color={getPositionColor(position)}>
          {position.toUpperCase()}
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
      title: 'Performance',
      key: 'performance',
      render: (record: Banner) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">
            {record.clicks.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">
            {record.impressions.toLocaleString()} impressions
          </div>
          <div className="text-xs text-blue-600">
            {record.conversionRate.toFixed(2)}% CTR
          </div>
        </div>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: number) => (
        <div className="text-center">
          <div className="text-lg font-semibold">{priority}</div>
        </div>
      ),
    },
    {
      title: 'Valid Period',
      key: 'period',
      render: (record: Banner) => (
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
      render: (record: Banner) => (
        <Space>
          <Tooltip title="View Analytics">
            <Button
              type="text"
              icon={<BarChartOutlined />}
              onClick={() => showAnalytics(record)}
            />
          </Tooltip>
          <Tooltip title={record.status === 'active' ? 'Deactivate' : 'Activate'}>
            <Button
              type="text"
              icon={record.status === 'active' ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={() => handleToggleStatus(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Copy">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => {
                const copy = { ...record, id: `banner_${Date.now()}`, name: `${record.name} (Copy)` };
                setBanners([copy, ...banners]);
                message.success('Banner copied successfully');
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

  const filteredBanners = banners.filter(banner => {
    const matchesSearch = banner.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         banner.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || banner.status === statusFilter;
    const matchesPosition = positionFilter === 'all' || banner.position === positionFilter;
    
    return matchesSearch && matchesStatus && matchesPosition;
  });

  // Calculate stats
  const totalBanners = banners.length;
  const activeBanners = banners.filter(b => b.status === 'active').length;
  const totalClicks = banners.reduce((sum, b) => sum + b.clicks, 0);
  const totalImpressions = banners.reduce((sum, b) => sum + b.impressions, 0);
  const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Banner Management</h1>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} size="large">
            Create Banner
          </Button>
        </Space>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Banners"
              value={totalBanners}
              valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<SettingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Active Banners"
              value={activeBanners}
              valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Clicks"
              value={totalClicks}
              valueStyle={{ color: '#f5a623', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<EyeOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Average CTR"
              value={averageCTR}
              precision={2}
              suffix="%"
              valueStyle={{ color: '#722ed1', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4 items-center">
          <Search
            placeholder="Search banners..."
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
            <Option value="scheduled">Scheduled</Option>
            <Option value="expired">Expired</Option>
          </Select>
          <Select
            style={{ width: 150 }}
            value={positionFilter}
            onChange={setPositionFilter}
            placeholder="Filter by position"
          >
            <Option value="all">All Positions</Option>
            <Option value="hero">Hero</Option>
            <Option value="top">Top</Option>
            <Option value="sidebar">Sidebar</Option>
            <Option value="footer">Footer</Option>
            <Option value="popup">Popup</Option>
            <Option value="category">Category</Option>
          </Select>
        </div>
      </Card>

      {/* Banners Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredBanners}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} banners`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Create/Edit Banner Modal */}
      <Modal
        title={editingBanner ? 'Edit Banner' : 'Create Banner'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
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
                name="name"
                label="Banner Name"
                rules={[{ required: true, message: 'Please enter banner name' }]}
              >
                <Input placeholder="Enter banner name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="position"
                label="Position"
                rules={[{ required: true, message: 'Please select position' }]}
              >
                <Select placeholder="Select position">
                  <Option value="hero">Hero Banner</Option>
                  <Option value="top">Top Banner</Option>
                  <Option value="sidebar">Sidebar Banner</Option>
                  <Option value="footer">Footer Banner</Option>
                  <Option value="popup">Popup Banner</Option>
                  <Option value="category">Category Banner</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="title"
            label="Banner Title"
            rules={[{ required: true, message: 'Please enter banner title' }]}
          >
            <Input placeholder="Enter banner title" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} placeholder="Enter banner description" />
          </Form.Item>

          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item name="linkUrl" label="Link URL">
                <Input placeholder="https://example.com/page" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="linkText" label="Link Text">
                <Input placeholder="Shop Now" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="dateRange"
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
              <Form.Item name="priority" label="Priority" initialValue={1}>
                <Select>
                  <Option value={1}>High (1)</Option>
                  <Option value={2}>Medium (2)</Option>
                  <Option value={3}>Low (3)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="targetAudience" label="Target Audience" initialValue="all">
                <Select>
                  <Option value="all">All Users</Option>
                  <Option value="new_users">New Users</Option>
                  <Option value="returning_users">Returning Users</Option>
                  <Option value="vip_users">VIP Users</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="devices" label="Target Devices" initialValue={['desktop', 'mobile']}>
            <Select mode="multiple" placeholder="Select target devices">
              <Option value="desktop">Desktop</Option>
              <Option value="mobile">Mobile</Option>
              <Option value="tablet">Tablet</Option>
            </Select>
          </Form.Item>

          <Form.Item name="imageUrl" label="Banner Image URL">
            <Input placeholder="https://example.com/banner.jpg" />
          </Form.Item>

          <Form.Item name="status" label="Status" initialValue="inactive">
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="scheduled">Scheduled</Option>
            </Select>
          </Form.Item>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingBanner ? 'Update Banner' : 'Create Banner'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Analytics Modal */}
      <Modal
        title={`Banner Analytics - ${selectedBanner?.name}`}
        open={analyticsVisible}
        onCancel={() => setAnalyticsVisible(false)}
        footer={[<Button key="close" onClick={() => setAnalyticsVisible(false)}>Close</Button>]}
        width={800}
      >
        {selectedBanner && (
          <div className="space-y-6">
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Statistic title="Clicks" value={selectedBanner.clicks} />
              </Col>
              <Col span={6}>
                <Statistic title="Impressions" value={selectedBanner.impressions} />
              </Col>
              <Col span={6}>
                <Statistic title="CTR" value={selectedBanner.conversionRate} precision={2} suffix="%" />
              </Col>
              <Col span={6}>
                <Statistic title="Priority" value={selectedBanner.priority} />
              </Col>
            </Row>

            {selectedBanner.abTest?.enabled && (
              <div>
                <h3 className="text-lg font-medium mb-4">A/B Test Results</h3>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card title="Variant A" size="small">
                      <div className="text-center mb-3">
                        <Image
                          width={200}
                          height={100}
                          src={selectedBanner.abTest.variantA.imageUrl}
                          className="rounded"
                          preview={false}
                        />
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{selectedBanner.abTest.variantA.title}</div>
                        <div className="text-sm text-gray-600">
                          {selectedBanner.abTest.variantA.clicks} clicks / {selectedBanner.abTest.variantA.impressions} impressions
                        </div>
                        <div className="text-lg font-semibold text-blue-600">
                          {((selectedBanner.abTest.variantA.clicks / selectedBanner.abTest.variantA.impressions) * 100).toFixed(2)}% CTR
                        </div>
                      </div>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="Variant B" size="small">
                      <div className="text-center mb-3">
                        <Image
                          width={200}
                          height={100}
                          src={selectedBanner.abTest.variantB.imageUrl}
                          className="rounded"
                          preview={false}
                        />
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{selectedBanner.abTest.variantB.title}</div>
                        <div className="text-sm text-gray-600">
                          {selectedBanner.abTest.variantB.clicks} clicks / {selectedBanner.abTest.variantB.impressions} impressions
                        </div>
                        <div className="text-lg font-semibold text-green-600">
                          {((selectedBanner.abTest.variantB.clicks / selectedBanner.abTest.variantB.impressions) * 100).toFixed(2)}% CTR
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BannerList;
