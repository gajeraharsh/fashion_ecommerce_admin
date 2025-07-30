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
  Collapse,
  Tooltip,
  Statistic,
  List,
  Avatar,
  Badge,
  Drawer,
  Descriptions,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  CopyOutlined,
  BarChartOutlined,
  FileTextOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import {
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

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  status: 'published' | 'draft' | 'archived';
  priority: number;
  views: number;
  helpful: number;
  notHelpful: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  featured: boolean;
  searchKeywords: string[];
}

interface FAQCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
  order: number;
}

const FAQList: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [categoryForm] = Form.useForm();

  useEffect(() => {
    // Mock data
    const mockCategories: FAQCategory[] = [
      {
        id: 'cat_001',
        name: 'Shipping & Delivery',
        description: 'Questions about shipping policies, delivery times, and tracking',
        icon: '🚚',
        count: 8,
        order: 1,
      },
      {
        id: 'cat_002',
        name: 'Returns & Exchanges',
        description: 'Information about return policies and exchange procedures',
        icon: '🔄',
        count: 12,
        order: 2,
      },
      {
        id: 'cat_003',
        name: 'Payment & Billing',
        description: 'Payment methods, billing issues, and refund policies',
        icon: '💳',
        count: 6,
        order: 3,
      },
      {
        id: 'cat_004',
        name: 'Product Information',
        description: 'Details about products, sizing, and specifications',
        icon: '📦',
        count: 15,
        order: 4,
      },
      {
        id: 'cat_005',
        name: 'Account & Profile',
        description: 'Account management, profile settings, and login issues',
        icon: '👤',
        count: 9,
        order: 5,
      },
    ];

    const mockFAQs: FAQ[] = [
      {
        id: 'faq_001',
        question: 'How long does shipping take?',
        answer: 'Standard shipping typically takes 3-5 business days within the continental US. Express shipping takes 1-2 business days. International shipping may take 7-14 business days depending on the destination.',
        category: 'Shipping & Delivery',
        tags: ['shipping', 'delivery', 'timeframe'],
        status: 'published',
        priority: 1,
        views: 1245,
        helpful: 892,
        notHelpful: 23,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-07T10:00:00Z',
        createdBy: 'Admin',
        featured: true,
        searchKeywords: ['shipping', 'delivery', 'time', 'how long', 'when'],
      },
      {
        id: 'faq_002',
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy for all items in original condition with tags attached. Items must be unworn and unwashed. Sale items are final sale and cannot be returned.',
        category: 'Returns & Exchanges',
        tags: ['returns', 'policy', 'refund'],
        status: 'published',
        priority: 2,
        views: 987,
        helpful: 765,
        notHelpful: 45,
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-06T15:30:00Z',
        createdBy: 'Admin',
        featured: true,
        searchKeywords: ['return', 'refund', 'policy', 'exchange'],
      },
      {
        id: 'faq_003',
        question: 'Do you accept international orders?',
        answer: 'Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by destination. Customers are responsible for any customs duties or taxes.',
        category: 'Shipping & Delivery',
        tags: ['international', 'shipping', 'worldwide'],
        status: 'published',
        priority: 3,
        views: 654,
        helpful: 523,
        notHelpful: 12,
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-05T12:00:00Z',
        createdBy: 'Admin',
        featured: false,
        searchKeywords: ['international', 'worldwide', 'global', 'shipping'],
      },
      {
        id: 'faq_004',
        question: 'How do I track my order?',
        answer: 'Once your order ships, you will receive a tracking number via email. You can use this number to track your package on our website or the carrier\'s website.',
        category: 'Shipping & Delivery',
        tags: ['tracking', 'order', 'shipping'],
        status: 'published',
        priority: 1,
        views: 1123,
        helpful: 981,
        notHelpful: 18,
        createdAt: '2024-01-04T00:00:00Z',
        updatedAt: '2024-01-04T08:00:00Z',
        createdBy: 'Admin',
        featured: true,
        searchKeywords: ['track', 'tracking', 'order', 'package', 'delivery'],
      },
      {
        id: 'faq_005',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers for large orders.',
        category: 'Payment & Billing',
        tags: ['payment', 'methods', 'credit card'],
        status: 'published',
        priority: 2,
        views: 789,
        helpful: 687,
        notHelpful: 34,
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-01-05T14:00:00Z',
        createdBy: 'Admin',
        featured: false,
        searchKeywords: ['payment', 'credit card', 'paypal', 'pay', 'billing'],
      },
    ];

    setCategories(mockCategories);
    setFaqs(mockFAQs);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      published: 'green',
      draft: 'orange',
      archived: 'gray',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const handleCreate = () => {
    setEditingFAQ(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFAQ(faq);
    form.setFieldsValue(faq);
    setModalVisible(true);
  };

  const handleSave = async (values: any) => {
    try {
      const faqData: FAQ = {
        id: editingFAQ?.id || `faq_${Date.now()}`,
        ...values,
        views: editingFAQ?.views || 0,
        helpful: editingFAQ?.helpful || 0,
        notHelpful: editingFAQ?.notHelpful || 0,
        createdAt: editingFAQ?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Admin',
        searchKeywords: values.question.toLowerCase().split(' ').concat(values.tags || []),
      };

      if (editingFAQ) {
        setFaqs(faqs.map(f => f.id === editingFAQ.id ? faqData : f));
        message.success('FAQ updated successfully');
      } else {
        setFaqs([faqData, ...faqs]);
        message.success('FAQ created successfully');
      }

      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save FAQ');
    }
  };

  const handleDelete = (faqId: string) => {
    Modal.confirm({
      title: 'Delete FAQ',
      content: 'Are you sure you want to delete this FAQ?',
      onOk: () => {
        setFaqs(faqs.filter(f => f.id !== faqId));
        message.success('FAQ deleted successfully');
      },
    });
  };

  const handleToggleStatus = (faq: FAQ) => {
    const newStatus = faq.status === 'published' ? 'draft' : 'published';
    setFaqs(faqs.map(f => 
      f.id === faq.id ? { ...f, status: newStatus } : f
    ));
    message.success(`FAQ ${newStatus === 'published' ? 'published' : 'saved as draft'}`);
  };

  const showPreview = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setPreviewVisible(true);
  };

  const columns = [
    {
      title: 'Question',
      key: 'question',
      render: (record: FAQ) => (
        <div className="max-w-md">
          <div className="font-medium mb-1">{record.question}</div>
          <div className="text-sm text-gray-600 line-clamp-2">
            {record.answer.substring(0, 100)}...
          </div>
          <div className="flex space-x-1 mt-2">
            {record.tags.slice(0, 3).map(tag => (
              <Tag key={tag} size="small">{tag}</Tag>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => {
        const cat = categories.find(c => c.name === category);
        return (
          <div className="flex items-center space-x-2">
            <span>{cat?.icon}</span>
            <span>{category}</span>
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: FAQ) => (
        <div className="flex flex-col items-center space-y-1">
          <Tag color={getStatusColor(status)}>
            {status.toUpperCase()}
          </Tag>
          {record.featured && (
            <Badge status="processing" text="Featured" />
          )}
        </div>
      ),
    },
    {
      title: 'Analytics',
      key: 'analytics',
      render: (record: FAQ) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">
            {record.views.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">views</div>
          <div className="text-sm text-green-600">
            {record.helpful} helpful
          </div>
          <div className="text-sm text-red-600">
            {record.notHelpful} not helpful
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
      title: 'Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => (
        <div className="text-sm">
          {new Date(date).toLocaleDateString()}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: FAQ) => (
        <Space>
          <Tooltip title="Preview">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => showPreview(record)}
            />
          </Tooltip>
          <Tooltip title={record.status === 'published' ? 'Unpublish' : 'Publish'}>
            <Button
              type="text"
              icon={record.status === 'published' ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
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
                const copy = { ...record, id: `faq_${Date.now()}`, question: `${record.question} (Copy)` };
                setFaqs([copy, ...faqs]);
                message.success('FAQ copied successfully');
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

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchText.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchText.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || faq.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || faq.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Calculate stats
  const totalFAQs = faqs.length;
  const publishedFAQs = faqs.filter(f => f.status === 'published').length;
  const totalViews = faqs.reduce((sum, f) => sum + f.views, 0);
  const totalHelpful = faqs.reduce((sum, f) => sum + f.helpful, 0);

  // Chart data
  const categoryData = categories.map(cat => ({
    name: cat.name,
    value: faqs.filter(f => f.category === cat.name).length,
    icon: cat.icon,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">FAQ Management</h1>
        <Space>
          <Button
            icon={<TagsOutlined />}
            onClick={() => setCategoryModalVisible(true)}
          >
            Manage Categories
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} size="large">
            Create FAQ
          </Button>
        </Space>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Total FAQs"
              value={totalFAQs}
              valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<QuestionCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Published"
              value={publishedFAQs}
              valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Views"
              value={totalViews}
              valueStyle={{ color: '#f5a623', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<EyeOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Helpful Votes"
              value={totalHelpful}
              valueStyle={{ color: '#722ed1', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Categories Overview */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="FAQ Categories">
            <List
              dataSource={categories}
              renderItem={category => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar size="large">{category.icon}</Avatar>}
                    title={category.name}
                    description={
                      <div>
                        <div className="text-sm text-gray-600 mb-1">{category.description}</div>
                        <Badge count={category.count} style={{ backgroundColor: '#52c41a' }} />
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card title="FAQ Distribution by Category">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
            placeholder="Search FAQs..."
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
            <Option value="published">Published</Option>
            <Option value="draft">Draft</Option>
            <Option value="archived">Archived</Option>
          </Select>
          <Select
            style={{ width: 200 }}
            value={categoryFilter}
            onChange={setCategoryFilter}
            placeholder="Filter by category"
          >
            <Option value="all">All Categories</Option>
            {categories.map(cat => (
              <Option key={cat.id} value={cat.name}>
                {cat.icon} {cat.name}
              </Option>
            ))}
          </Select>
        </div>
      </Card>

      {/* FAQs Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredFAQs}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} FAQs`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Create/Edit FAQ Modal */}
      <Modal
        title={editingFAQ ? 'Edit FAQ' : 'Create FAQ'}
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
          <Form.Item
            name="question"
            label="Question"
            rules={[{ required: true, message: 'Please enter the question' }]}
          >
            <Input placeholder="Enter the FAQ question" />
          </Form.Item>

          <Form.Item
            name="answer"
            label="Answer"
            rules={[{ required: true, message: 'Please enter the answer' }]}
          >
            <TextArea
              rows={6}
              placeholder="Enter the detailed answer"
              showCount
              maxLength={1000}
            />
          </Form.Item>

          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select a category' }]}
              >
                <Select placeholder="Select category">
                  {categories.map(cat => (
                    <Option key={cat.id} value={cat.name}>
                      {cat.icon} {cat.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="priority" label="Priority" initialValue={3}>
                <Select>
                  <Option value={1}>High (1)</Option>
                  <Option value={2}>Medium (2)</Option>
                  <Option value={3}>Low (3)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="tags" label="Tags">
            <Select
              mode="tags"
              placeholder="Add tags for better searchability"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item name="status" label="Status" initialValue="draft">
                <Select>
                  <Option value="published">Published</Option>
                  <Option value="draft">Draft</Option>
                  <Option value="archived">Archived</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="featured" valuePropName="checked">
                <Switch /> Featured FAQ
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingFAQ ? 'Update FAQ' : 'Create FAQ'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        title="FAQ Preview"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[<Button key="close" onClick={() => setPreviewVisible(false)}>Close</Button>]}
        width={700}
      >
        {selectedFAQ && (
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-2">{selectedFAQ.question}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Category: {selectedFAQ.category}</span>
                <span>Views: {selectedFAQ.views}</span>
                <span>Priority: {selectedFAQ.priority}</span>
                {selectedFAQ.featured && <Badge status="processing" text="Featured" />}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-800 leading-relaxed">{selectedFAQ.answer}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {selectedFAQ.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex space-x-4">
                <span className="text-green-600">👍 {selectedFAQ.helpful} helpful</span>
                <span className="text-red-600">👎 {selectedFAQ.notHelpful} not helpful</span>
              </div>
              <div className="text-sm text-gray-500">
                Last updated: {new Date(selectedFAQ.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FAQList;
