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
  DatePicker,
  Modal,
  Form,
  message,
  Progress,
  Timeline,
  Badge,
  Tooltip,
  Dropdown,
  Menu,
  Typography,
  Avatar,
  List,
  Tabs,
} from 'antd';
import {
  PlusOutlined,
  SendOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FilterOutlined,
  SearchOutlined,
  MailOutlined,
  UserOutlined,
  CalendarOutlined,
  BarChartOutlined,
  FileExcelOutlined,
  CopyOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Title } = Typography;

interface Newsletter {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'sent' | 'scheduled' | 'sending';
  subscribers: number;
  openRate: number;
  clickRate: number;
  sentDate?: string;
  scheduledDate?: string;
  content: string;
  template: string;
  tags: string[];
}

interface Subscriber {
  id: string;
  email: string;
  name: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  subscribeDate: string;
  lastActivity: string;
  source: string;
  tags: string[];
  location: string;
}

const NewsletterList: React.FC = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('campaigns');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingNewsletter, setEditingNewsletter] = useState<Newsletter | null>(null);
  const [form] = Form.useForm();

  // Mock data
  useEffect(() => {
    setNewsletters([
      {
        id: '1',
        name: 'Weekly Fashion Trends',
        subject: 'Latest Spring Collection 2024',
        status: 'sent',
        subscribers: 15420,
        openRate: 24.5,
        clickRate: 3.2,
        sentDate: '2024-01-15',
        content: 'Newsletter content...',
        template: 'fashion-weekly',
        tags: ['weekly', 'fashion', 'trends'],
      },
      {
        id: '2',
        name: 'Sale Announcement',
        subject: 'Up to 50% Off Everything!',
        status: 'scheduled',
        subscribers: 18200,
        openRate: 0,
        clickRate: 0,
        scheduledDate: '2024-01-20',
        content: 'Sale content...',
        template: 'sale-promo',
        tags: ['sale', 'promotion'],
      },
      {
        id: '3',
        name: 'New Arrivals',
        subject: 'Fresh Styles Just Landed',
        status: 'draft',
        subscribers: 0,
        openRate: 0,
        clickRate: 0,
        content: 'New arrivals content...',
        template: 'new-arrivals',
        tags: ['new', 'arrivals'],
      },
    ]);

    setSubscribers([
      {
        id: '1',
        email: 'user1@example.com',
        name: 'John Doe',
        status: 'active',
        subscribeDate: '2023-12-01',
        lastActivity: '2024-01-15',
        source: 'Website',
        tags: ['premium', 'fashion'],
        location: 'New York, US',
      },
      {
        id: '2',
        email: 'user2@example.com',
        name: 'Jane Smith',
        status: 'active',
        subscribeDate: '2023-11-15',
        lastActivity: '2024-01-14',
        source: 'Social Media',
        tags: ['regular', 'sales'],
        location: 'Los Angeles, US',
      },
      {
        id: '3',
        email: 'user3@example.com',
        name: 'Bob Johnson',
        status: 'unsubscribed',
        subscribeDate: '2023-10-20',
        lastActivity: '2024-01-10',
        source: 'Email Campaign',
        tags: ['inactive'],
        location: 'Chicago, US',
      },
    ]);
  }, []);

  const filteredNewsletters = newsletters.filter(newsletter => {
    const matchesSearch = newsletter.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         newsletter.subject.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || newsletter.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchText.toLowerCase()) ||
                         subscriber.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || subscriber.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateNewsletter = () => {
    setEditingNewsletter(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditNewsletter = (newsletter: Newsletter) => {
    setEditingNewsletter(newsletter);
    form.setFieldsValue(newsletter);
    setIsModalVisible(true);
  };

  const handleSaveNewsletter = async (values: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingNewsletter) {
        setNewsletters(prev => prev.map(item => 
          item.id === editingNewsletter.id ? { ...item, ...values } : item
        ));
        message.success('Newsletter updated successfully!');
      } else {
        const newNewsletter: Newsletter = {
          id: String(Date.now()),
          ...values,
          status: 'draft',
          subscribers: 0,
          openRate: 0,
          clickRate: 0,
        };
        setNewsletters(prev => [...prev, newNewsletter]);
        message.success('Newsletter created successfully!');
      }
      
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to save newsletter');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNewsletter = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setNewsletters(prev => prev.filter(item => item.id !== id));
      message.success('Newsletter deleted successfully!');
    } catch (error) {
      message.error('Failed to delete newsletter');
    } finally {
      setLoading(false);
    }
  };

  const campaignColumns = [
    {
      title: 'Campaign',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Newsletter) => (
        <div>
          <div className="font-semibold">{text}</div>
          <div className="text-sm text-gray-500">{record.subject}</div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          draft: 'default',
          sent: 'green',
          scheduled: 'blue',
          sending: 'orange',
        };
        return <Tag color={colors[status as keyof typeof colors]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Subscribers',
      dataIndex: 'subscribers',
      key: 'subscribers',
      render: (count: number) => count.toLocaleString(),
    },
    {
      title: 'Open Rate',
      dataIndex: 'openRate',
      key: 'openRate',
      render: (rate: number) => `${rate}%`,
    },
    {
      title: 'Click Rate',
      dataIndex: 'clickRate',
      key: 'clickRate',
      render: (rate: number) => `${rate}%`,
    },
    {
      title: 'Date',
      key: 'date',
      render: (record: Newsletter) => {
        if (record.status === 'sent' && record.sentDate) {
          return <span>Sent: {record.sentDate}</span>;
        }
        if (record.status === 'scheduled' && record.scheduledDate) {
          return <span>Scheduled: {record.scheduledDate}</span>;
        }
        return <span>-</span>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Newsletter) => (
        <Space size="small">
          <Tooltip title="View">
            <Button size="small" icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button size="small" icon={<EditOutlined />} onClick={() => handleEditNewsletter(record)} />
          </Tooltip>
          <Tooltip title="Copy">
            <Button size="small" icon={<CopyOutlined />} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDeleteNewsletter(record.id)} />
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
        <div className="flex items-center">
          <Avatar icon={<UserOutlined />} className="mr-3" />
          <div>
            <div className="font-semibold">{record.name}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          active: 'green',
          unsubscribed: 'red',
          bounced: 'orange',
        };
        return <Tag color={colors[status as keyof typeof colors]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Subscribed',
      dataIndex: 'subscribeDate',
      key: 'subscribeDate',
    },
    {
      title: 'Last Activity',
      dataIndex: 'lastActivity',
      key: 'lastActivity',
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Subscriber) => (
        <Space size="small">
          <Tooltip title="View Profile">
            <Button size="small" icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button size="small" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Unsubscribe">
            <Button size="small" icon={<UserDeleteOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: 'campaigns',
      label: 'Campaigns',
      children: (
        <>
          <Card className="mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <Search
                placeholder="Search campaigns..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
              />
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 150 }}
              >
                <Option value="all">All Status</Option>
                <Option value="draft">Draft</Option>
                <Option value="sent">Sent</Option>
                <Option value="scheduled">Scheduled</Option>
                <Option value="sending">Sending</Option>
              </Select>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateNewsletter}>
                Create Campaign
              </Button>
            </div>
          </Card>

          <Card>
            <Table
              columns={campaignColumns}
              dataSource={filteredNewsletters}
              rowKey="id"
              loading={loading}
              pagination={{
                total: filteredNewsletters.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} campaigns`,
              }}
            />
          </Card>
        </>
      ),
    },
    {
      key: 'subscribers',
      label: 'Subscribers',
      children: (
        <>
          <Card className="mb-6">
            <Row gutter={16}>
              <Col xs={24} sm={6}>
                <Statistic title="Total Subscribers" value={subscribers.length} prefix={<UserOutlined />} />
              </Col>
              <Col xs={24} sm={6}>
                <Statistic title="Active" value={subscribers.filter(s => s.status === 'active').length} />
              </Col>
              <Col xs={24} sm={6}>
                <Statistic title="Unsubscribed" value={subscribers.filter(s => s.status === 'unsubscribed').length} />
              </Col>
              <Col xs={24} sm={6}>
                <Statistic title="Bounced" value={subscribers.filter(s => s.status === 'bounced').length} />
              </Col>
            </Row>
          </Card>

          <Card className="mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <Search
                placeholder="Search subscribers..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
              />
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 150 }}
              >
                <Option value="all">All Status</Option>
                <Option value="active">Active</Option>
                <Option value="unsubscribed">Unsubscribed</Option>
                <Option value="bounced">Bounced</Option>
              </Select>
              <Button type="primary" icon={<UserAddOutlined />}>
                Add Subscriber
              </Button>
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
                total: filteredSubscribers.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} subscribers`,
              }}
            />
          </Card>
        </>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2}>Newsletter Management</Title>
      </div>

      <Row gutter={16} className="mb-6">
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="Total Campaigns" value={newsletters.length} prefix={<MailOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="Sent This Month" value={newsletters.filter(n => n.status === 'sent').length} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="Total Subscribers" value={subscribers.length} suffix="K" precision={1} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="Avg Open Rate" value={18.2} suffix="%" precision={1} />
          </Card>
        </Col>
      </Row>

      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card" items={tabItems} />

      <Modal
        title={editingNewsletter ? 'Edit Campaign' : 'Create New Campaign'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveNewsletter}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label="Campaign Name"
                rules={[{ required: true, message: 'Please enter campaign name' }]}
              >
                <Input placeholder="Enter campaign name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="template"
                label="Template"
                rules={[{ required: true, message: 'Please select template' }]}
              >
                <Select placeholder="Select template">
                  <Option value="fashion-weekly">Fashion Weekly</Option>
                  <Option value="sale-promo">Sale Promotion</Option>
                  <Option value="new-arrivals">New Arrivals</Option>
                  <Option value="custom">Custom</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="subject"
            label="Email Subject"
            rules={[{ required: true, message: 'Please enter email subject' }]}
          >
            <Input placeholder="Enter email subject line" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Email Content"
            rules={[{ required: true, message: 'Please enter email content' }]}
          >
            <TextArea rows={8} placeholder="Enter your email content here..." />
          </Form.Item>

          <Form.Item name="tags" label="Tags">
            <Select mode="tags" placeholder="Add tags" style={{ width: '100%' }}>
              <Option value="weekly">Weekly</Option>
              <Option value="sale">Sale</Option>
              <Option value="promotion">Promotion</Option>
              <Option value="new">New</Option>
              <Option value="fashion">Fashion</Option>
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
            <Button type="default" htmlType="submit" loading={loading}>
              Save as Draft
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingNewsletter ? 'Update Campaign' : 'Create Campaign'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default NewsletterList;
