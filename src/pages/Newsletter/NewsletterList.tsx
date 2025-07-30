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
  Tabs,
  List,
  Avatar,
  Tooltip,
  Typography,
  DatePicker,
  Upload,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  MailOutlined,
  SendOutlined,
  UserOutlined,
  BarChartOutlined,
  EyeOutlined,
  HeartOutlined,
  ShareAltOutlined,
  CloudUploadOutlined,
  FileExcelOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
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
} from 'recharts';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Title } = Typography;

interface Subscriber {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: 'active' | 'unsubscribed' | 'bounced' | 'pending';
  subscribedAt: string;
  lastEngagement: string;
  tags: string[];
  source: string;
  engagement: {
    opens: number;
    clicks: number;
    purchases: number;
  };
}

interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent' | 'sending';
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
  recipients: number;
  opens: number;
  clicks: number;
  unsubscribes: number;
  bounces: number;
  openRate: number;
  clickRate: number;
  tags: string[];
  template: string;
}

const NewsletterList: React.FC = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [campaignModalVisible, setCampaignModalVisible] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [content, setContent] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    // Mock data
    const mockCampaigns: Campaign[] = [
      {
        id: 'camp_001',
        name: 'Summer Sale Newsletter',
        subject: '🌞 Summer Sale - Up to 70% Off Fashion Favorites!',
        content: '<h2>Summer Sale is Here!</h2><p>Don\'t miss out on our biggest sale of the year...</p>',
        status: 'sent',
        sentAt: '2024-01-07T10:00:00Z',
        createdAt: '2024-01-05T14:00:00Z',
        updatedAt: '2024-01-07T10:00:00Z',
        recipients: 5234,
        opens: 2156,
        clicks: 432,
        unsubscribes: 23,
        bounces: 45,
        openRate: 41.2,
        clickRate: 20.0,
        tags: ['sale', 'summer', 'fashion'],
        template: 'sale-template',
      },
      {
        id: 'camp_002',
        name: 'New Collection Announcement',
        subject: '✨ New Arrivals - Fresh Styles Just Landed',
        content: '<h2>New Collection</h2><p>Discover our latest fashion pieces...</p>',
        status: 'sent',
        sentAt: '2024-01-05T12:00:00Z',
        createdAt: '2024-01-03T16:00:00Z',
        updatedAt: '2024-01-05T12:00:00Z',
        recipients: 5234,
        opens: 1987,
        clicks: 298,
        unsubscribes: 12,
        bounces: 38,
        openRate: 38.0,
        clickRate: 15.0,
        tags: ['new arrivals', 'collection'],
        template: 'product-template',
      },
      {
        id: 'camp_003',
        name: 'Weekly Fashion Tips',
        subject: 'Your Weekly Style Guide - 5 Trending Looks',
        content: '<h2>This Week\'s Style Tips</h2><p>Get inspired with these trending looks...</p>',
        status: 'draft',
        createdAt: '2024-01-06T10:00:00Z',
        updatedAt: '2024-01-07T08:00:00Z',
        recipients: 0,
        opens: 0,
        clicks: 0,
        unsubscribes: 0,
        bounces: 0,
        openRate: 0,
        clickRate: 0,
        tags: ['tips', 'style', 'weekly'],
        template: 'content-template',
      },
    ];

    const mockSubscribers: Subscriber[] = [
      {
        id: 'sub_001',
        email: 'sarah.johnson@example.com',
        firstName: 'Sarah',
        lastName: 'Johnson',
        status: 'active',
        subscribedAt: '2023-12-15T10:00:00Z',
        lastEngagement: '2024-01-07T09:30:00Z',
        tags: ['vip', 'fashion-lover'],
        source: 'website',
        engagement: {
          opens: 45,
          clicks: 23,
          purchases: 8,
        },
      },
      {
        id: 'sub_002',
        email: 'mike.chen@example.com',
        firstName: 'Mike',
        lastName: 'Chen',
        status: 'active',
        subscribedAt: '2024-01-01T14:00:00Z',
        lastEngagement: '2024-01-06T16:20:00Z',
        tags: ['new-subscriber'],
        source: 'social-media',
        engagement: {
          opens: 12,
          clicks: 5,
          purchases: 2,
        },
      },
      {
        id: 'sub_003',
        email: 'emma.davis@example.com',
        firstName: 'Emma',
        lastName: 'Davis',
        status: 'unsubscribed',
        subscribedAt: '2023-11-20T08:00:00Z',
        lastEngagement: '2023-12-28T11:15:00Z',
        tags: ['inactive'],
        source: 'popup',
        engagement: {
          opens: 8,
          clicks: 2,
          purchases: 0,
        },
      },
    ];

    setCampaigns(mockCampaigns);
    setSubscribers(mockSubscribers);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'orange',
      scheduled: 'blue',
      sent: 'green',
      sending: 'purple',
      active: 'green',
      unsubscribed: 'red',
      bounced: 'volcano',
      pending: 'gold',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      draft: <EditOutlined />,
      scheduled: <CalendarOutlined />,
      sent: <CheckCircleOutlined />,
      sending: <SyncOutlined spin />,
      active: <CheckCircleOutlined />,
      unsubscribed: <CloseCircleOutlined />,
      bounced: <CloseCircleOutlined />,
      pending: <SyncOutlined />,
    };
    return icons[status as keyof typeof icons] || <SyncOutlined />;
  };

  const handleCreateCampaign = () => {
    setEditingCampaign(null);
    form.resetFields();
    setContent('');
    setCampaignModalVisible(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setContent(campaign.content);
    form.setFieldsValue(campaign);
    setCampaignModalVisible(true);
  };

  const handleSaveCampaign = async (values: any) => {
    try {
      const campaignData: Campaign = {
        id: editingCampaign?.id || `camp_${Date.now()}`,
        ...values,
        content,
        recipients: editingCampaign?.recipients || 0,
        opens: editingCampaign?.opens || 0,
        clicks: editingCampaign?.clicks || 0,
        unsubscribes: editingCampaign?.unsubscribes || 0,
        bounces: editingCampaign?.bounces || 0,
        openRate: editingCampaign?.openRate || 0,
        clickRate: editingCampaign?.clickRate || 0,
        createdAt: editingCampaign?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingCampaign) {
        setCampaigns(campaigns.map(c => c.id === editingCampaign.id ? campaignData : c));
        message.success('Campaign updated successfully');
      } else {
        setCampaigns([campaignData, ...campaigns]);
        message.success('Campaign created successfully');
      }

      setCampaignModalVisible(false);
      form.resetFields();
      setContent('');
    } catch (error) {
      message.error('Failed to save campaign');
    }
  };

  const handleSendCampaign = (campaign: Campaign) => {
    Modal.confirm({
      title: 'Send Campaign',
      content: `Are you sure you want to send "${campaign.name}" to ${subscribers.filter(s => s.status === 'active').length} subscribers?`,
      onOk: () => {
        setCampaigns(campaigns.map(c => 
          c.id === campaign.id ? { 
            ...c, 
            status: 'sent',
            sentAt: new Date().toISOString(),
            recipients: subscribers.filter(s => s.status === 'active').length
          } : c
        ));
        message.success('Campaign sent successfully');
      },
    });
  };

  const campaignColumns = [
    {
      title: 'Campaign',
      key: 'campaign',
      render: (record: Campaign) => (
        <div>
          <div className="font-medium text-gray-900 mb-1">{record.name}</div>
          <div className="text-sm text-gray-600">{record.subject}</div>
          <div className="flex space-x-1 mt-2">
            {record.tags.map(tag => (
              <Tag key={tag} size="small">{tag}</Tag>
            ))}
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
      title: 'Recipients',
      dataIndex: 'recipients',
      key: 'recipients',
      render: (recipients: number) => (
        <div className="text-center">
          <div className="text-lg font-semibold">{recipients.toLocaleString()}</div>
        </div>
      ),
    },
    {
      title: 'Performance',
      key: 'performance',
      render: (record: Campaign) => (
        <div className="text-center">
          <div className="flex justify-between text-sm">
            <Tooltip title="Open Rate">
              <span><EyeOutlined /> {record.openRate.toFixed(1)}%</span>
            </Tooltip>
            <Tooltip title="Click Rate">
              <span><ShareAltOutlined /> {record.clickRate.toFixed(1)}%</span>
            </Tooltip>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {record.opens} opens • {record.clicks} clicks
          </div>
        </div>
      ),
    },
    {
      title: 'Date',
      key: 'date',
      render: (record: Campaign) => (
        <div className="text-sm">
          {record.sentAt ? (
            <div>
              <div>Sent:</div>
              <div>{new Date(record.sentAt).toLocaleDateString()}</div>
            </div>
          ) : (
            <div>
              <div>Created:</div>
              <div>{new Date(record.createdAt).toLocaleDateString()}</div>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Campaign) => (
        <Space>
          {record.status === 'draft' && (
            <Tooltip title="Send Campaign">
              <Button
                type="text"
                icon={<SendOutlined />}
                onClick={() => handleSendCampaign(record)}
              />
            </Tooltip>
          )}
          <Tooltip title="View Analytics">
            <Button
              type="text"
              icon={<BarChartOutlined />}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditCampaign(record)}
              disabled={record.status === 'sent'}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              disabled={record.status === 'sent'}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const subscriberColumns = [
    {
      title: 'Subscriber',
      key: 'subscriber',
      render: (record: Subscriber) => (
        <div className="flex items-center space-x-3">
          <Avatar icon={<UserOutlined />} />
          <div>
            <div className="font-medium">{record.firstName} {record.lastName}</div>
            <div className="text-sm text-gray-600">{record.email}</div>
            <div className="flex space-x-1 mt-1">
              {record.tags.map(tag => (
                <Tag key={tag} size="small">{tag}</Tag>
              ))}
            </div>
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
      title: 'Engagement',
      key: 'engagement',
      render: (record: Subscriber) => (
        <div className="text-center">
          <div className="text-sm">
            <span>{record.engagement.opens} opens</span>
          </div>
          <div className="text-sm">
            <span>{record.engagement.clicks} clicks</span>
          </div>
          <div className="text-sm">
            <span>{record.engagement.purchases} purchases</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      render: (source: string) => (
        <Tag>{source.replace('-', ' ')}</Tag>
      ),
    },
    {
      title: 'Subscribed',
      dataIndex: 'subscribedAt',
      key: 'subscribedAt',
      render: (date: string) => (
        <div className="text-sm">
          {new Date(date).toLocaleDateString()}
        </div>
      ),
    },
  ];

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         campaign.subject.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchText.toLowerCase()) ||
                         subscriber.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
                         subscriber.lastName.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || subscriber.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalSubscribers = subscribers.length;
  const activeSubscribers = subscribers.filter(s => s.status === 'active').length;
  const totalCampaigns = campaigns.filter(c => c.status === 'sent').length;
  const averageOpenRate = campaigns.length > 0 ? 
    campaigns.reduce((sum, c) => sum + c.openRate, 0) / campaigns.length : 0;

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-0">Newsletter Management</Title>
          <p className="text-gray-600">Manage your email campaigns and subscribers</p>
        </div>
        <Space>
          <Button icon={<CloudUploadOutlined />}>Import Subscribers</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateCampaign} size="large">
            Create Campaign
          </Button>
        </Space>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Subscribers"
              value={totalSubscribers}
              valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Active Subscribers"
              value={activeSubscribers}
              valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<CheckCircleOutlined />}
              suffix={
                <div className="text-sm text-green-600 mt-1">
                  {((activeSubscribers / totalSubscribers) * 100).toFixed(1)}% active
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Campaigns Sent"
              value={totalCampaigns}
              valueStyle={{ color: '#f5a623', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<MailOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Avg Open Rate"
              value={averageOpenRate}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#722ed1', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<EyeOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
        <TabPane tab="Campaigns" key="campaigns">
          {/* Filters */}
          <Card className="mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <Search
                placeholder="Search campaigns..."
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
                <Option value="draft">Draft</Option>
                <Option value="scheduled">Scheduled</Option>
                <Option value="sent">Sent</Option>
                <Option value="sending">Sending</Option>
              </Select>
            </div>
          </Card>

          <Card>
            <Table
              columns={campaignColumns}
              dataSource={filteredCampaigns}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} campaigns`,
              }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Subscribers" key="subscribers">
          {/* Filters */}
          <Card className="mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <Search
                placeholder="Search subscribers..."
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
                <Option value="unsubscribed">Unsubscribed</Option>
                <Option value="bounced">Bounced</Option>
                <Option value="pending">Pending</Option>
              </Select>
              <Button icon={<FileExcelOutlined />}>Export</Button>
            </div>
          </Card>

          <Card>
            <Table
              columns={subscriberColumns}
              dataSource={filteredSubscribers}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 15,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} subscribers`,
              }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Create/Edit Campaign Modal */}
      <Modal
        title={editingCampaign ? 'Edit Campaign' : 'Create Campaign'}
        open={campaignModalVisible}
        onCancel={() => setCampaignModalVisible(false)}
        footer={null}
        width={1000}
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveCampaign}
          className="mt-4"
        >
          <Row gutter={[24, 0]}>
            <Col xs={24} lg={16}>
              <Form.Item
                name="name"
                label="Campaign Name"
                rules={[{ required: true, message: 'Please enter campaign name' }]}
              >
                <Input placeholder="Enter campaign name" />
              </Form.Item>

              <Form.Item
                name="subject"
                label="Email Subject"
                rules={[{ required: true, message: 'Please enter email subject' }]}
              >
                <Input placeholder="Enter email subject line" />
              </Form.Item>

              <Form.Item label="Email Content" required>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={quillModules}
                  style={{ height: '300px', marginBottom: '50px' }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} lg={8}>
              <Form.Item name="status" label="Status" initialValue="draft">
                <Select>
                  <Option value="draft">Draft</Option>
                  <Option value="scheduled">Scheduled</Option>
                </Select>
              </Form.Item>

              <Form.Item name="scheduledAt" label="Schedule Date">
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item name="template" label="Template" initialValue="default">
                <Select>
                  <Option value="default">Default</Option>
                  <Option value="sale-template">Sale Template</Option>
                  <Option value="product-template">Product Template</Option>
                  <Option value="content-template">Content Template</Option>
                </Select>
              </Form.Item>

              <Form.Item name="tags" label="Tags">
                <Select
                  mode="tags"
                  placeholder="Add tags"
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <div className="border-t pt-4 mt-4">
                <h4 className="text-lg font-medium mb-3">Target Audience</h4>
                <div className="text-sm text-gray-600 mb-2">
                  This campaign will be sent to {activeSubscribers} active subscribers
                </div>
                <Progress percent={100} showInfo={false} strokeColor="#52c41a" />
              </div>
            </Col>
          </Row>

          <div className="flex justify-end space-x-2 pt-6 border-t">
            <Button onClick={() => setCampaignModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default NewsletterList;
