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
  Switch,
  message,
  Image,
  Statistic,
  Avatar,
  Tooltip,
  Badge,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  FileTextOutlined,
  CalendarOutlined,
  UserOutlined,
  ShareAltOutlined,
  HeartOutlined,
  MessageOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Title } = Typography;

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  authorAvatar: string;
  status: 'published' | 'draft' | 'scheduled' | 'archived';
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  categories: string[];
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  shares: number;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    canonicalUrl?: string;
  };
  featured: boolean;
  allowComments: boolean;
  readingTime: number;
}

const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [content, setContent] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    // Mock data
    const mockPosts: BlogPost[] = [
      {
        id: 'post_001',
        title: 'Summer Fashion Trends 2024: What\'s Hot This Season',
        slug: 'summer-fashion-trends-2024',
        excerpt: 'Discover the hottest summer fashion trends that are dominating 2024. From vibrant colors to sustainable fabrics, here\'s what you need to know.',
        content: '<p>Summer 2024 is all about bold expressions and sustainable choices...</p>',
        featuredImage: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=400',
        author: 'Sarah Johnson',
        authorAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
        status: 'published',
        publishedAt: '2024-01-07T10:00:00Z',
        createdAt: '2024-01-05T14:00:00Z',
        updatedAt: '2024-01-07T10:00:00Z',
        categories: ['Fashion', 'Trends'],
        tags: ['summer', 'fashion', 'trends', '2024', 'style'],
        views: 2456,
        likes: 189,
        comments: 34,
        shares: 78,
        seo: {
          metaTitle: 'Summer Fashion Trends 2024 - Latest Style Guide',
          metaDescription: 'Explore the must-have summer fashion trends for 2024. Get inspired by the latest styles, colors, and sustainable fashion choices.',
          keywords: ['summer fashion', 'trends 2024', 'style guide', 'fashion tips'],
        },
        featured: true,
        allowComments: true,
        readingTime: 5,
      },
      {
        id: 'post_002',
        title: 'Sustainable Fashion: Building an Eco-Friendly Wardrobe',
        slug: 'sustainable-fashion-eco-friendly-wardrobe',
        excerpt: 'Learn how to build a sustainable wardrobe that\'s both stylish and environmentally conscious. Tips for ethical fashion choices.',
        content: '<p>Sustainable fashion is more than just a trend...</p>',
        featuredImage: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=400',
        author: 'Mike Chen',
        authorAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
        status: 'published',
        publishedAt: '2024-01-05T12:00:00Z',
        createdAt: '2024-01-03T16:00:00Z',
        updatedAt: '2024-01-05T12:00:00Z',
        categories: ['Sustainability', 'Fashion'],
        tags: ['sustainable', 'eco-friendly', 'ethical', 'wardrobe'],
        views: 1897,
        likes: 234,
        comments: 45,
        shares: 89,
        seo: {
          metaTitle: 'Sustainable Fashion Guide - Eco-Friendly Wardrobe Tips',
          metaDescription: 'Build an eco-friendly wardrobe with our sustainable fashion guide. Learn about ethical brands and green fashion choices.',
          keywords: ['sustainable fashion', 'eco-friendly', 'ethical fashion', 'green wardrobe'],
        },
        featured: false,
        allowComments: true,
        readingTime: 7,
      },
      {
        id: 'post_003',
        title: 'Fashion Week Highlights: Designer Collections Review',
        slug: 'fashion-week-highlights-designer-collections',
        excerpt: 'A comprehensive review of the most stunning designer collections from this year\'s fashion week events worldwide.',
        content: '<p>Fashion Week never disappoints...</p>',
        featuredImage: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400',
        author: 'Emma Davis',
        authorAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
        status: 'draft',
        publishedAt: '',
        createdAt: '2024-01-06T10:00:00Z',
        updatedAt: '2024-01-07T08:00:00Z',
        categories: ['Fashion Week', 'Designers'],
        tags: ['fashion week', 'designers', 'collections', 'runway'],
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        seo: {
          metaTitle: 'Fashion Week 2024 - Designer Collections Review',
          metaDescription: 'Get the latest highlights from fashion week events. Review of top designer collections and runway trends.',
          keywords: ['fashion week', 'designer collections', 'runway', 'fashion show'],
        },
        featured: false,
        allowComments: true,
        readingTime: 6,
      },
    ];

    setPosts(mockPosts);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      published: 'green',
      draft: 'orange',
      scheduled: 'blue',
      archived: 'gray',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      published: <CheckCircleOutlined />,
      draft: <EditOutlined />,
      scheduled: <CalendarOutlined />,
      archived: <CloseCircleOutlined />,
    };
    return icons[status as keyof typeof icons] || <SyncOutlined />;
  };

  const handleCreate = () => {
    setEditingPost(null);
    form.resetFields();
    setContent('');
    setModalVisible(true);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setContent(post.content);
    form.setFieldsValue({
      ...post,
      publishedAt: post.publishedAt ? dayjs(post.publishedAt) : null,
    });
    setModalVisible(true);
  };

  const handleSave = async (values: any) => {
    try {
      const postData: BlogPost = {
        id: editingPost?.id || `post_${Date.now()}`,
        ...values,
        content,
        slug: values.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        publishedAt: values.publishedAt ? values.publishedAt.toISOString() : '',
        views: editingPost?.views || 0,
        likes: editingPost?.likes || 0,
        comments: editingPost?.comments || 0,
        shares: editingPost?.shares || 0,
        readingTime: Math.max(1, Math.ceil(content.replace(/<[^>]*>/g, '').split(' ').length / 200)),
        createdAt: editingPost?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingPost) {
        setPosts(posts.map(p => p.id === editingPost.id ? postData : p));
        message.success('Blog post updated successfully');
      } else {
        setPosts([postData, ...posts]);
        message.success('Blog post created successfully');
      }

      setModalVisible(false);
      form.resetFields();
      setContent('');
    } catch (error) {
      message.error('Failed to save blog post');
    }
  };

  const handleDelete = (postId: string) => {
    Modal.confirm({
      title: 'Delete Blog Post',
      content: 'Are you sure you want to delete this blog post?',
      onOk: () => {
        setPosts(posts.filter(p => p.id !== postId));
        message.success('Blog post deleted successfully');
      },
    });
  };

  const handleToggleStatus = (post: BlogPost) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    setPosts(posts.map(p => 
      p.id === post.id ? { 
        ...p, 
        status: newStatus,
        publishedAt: newStatus === 'published' ? new Date().toISOString() : ''
      } : p
    ));
    message.success(`Blog post ${newStatus === 'published' ? 'published' : 'saved as draft'}`);
  };

  const columns = [
    {
      title: 'Post',
      key: 'post',
      render: (record: BlogPost) => (
        <div className="flex items-start space-x-3">
          <Image
            width={80}
            height={60}
            src={record.featuredImage}
            className="rounded-lg object-cover"
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RUG8G+0Y4Hh0CAIHx8YAGH1AZAjWOOAI1hjjAOOYI1zjmCNA1hjjAOOYI0xjjEOOAI0wrDgA2AEOOAAOhKKbKUVKmcBGvZNfNaE..."
          />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 mb-1 line-clamp-2">{record.title}</div>
            <div className="text-sm text-gray-600 line-clamp-2 mb-2">{record.excerpt}</div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Avatar size={16} src={record.authorAvatar} />
              <span>{record.author}</span>
              <span>•</span>
              <span>{record.readingTime} min read</span>
              {record.featured && (
                <>
                  <span>•</span>
                  <Badge status="processing" text="Featured" />
                </>
              )}
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
      title: 'Analytics',
      key: 'analytics',
      render: (record: BlogPost) => (
        <div className="text-center">
          <div className="flex justify-between text-sm">
            <Tooltip title="Views">
              <span><EyeOutlined /> {record.views}</span>
            </Tooltip>
            <Tooltip title="Likes">
              <span><HeartOutlined /> {record.likes}</span>
            </Tooltip>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <Tooltip title="Comments">
              <span><MessageOutlined /> {record.comments}</span>
            </Tooltip>
            <Tooltip title="Shares">
              <span><ShareAltOutlined /> {record.shares}</span>
            </Tooltip>
          </div>
        </div>
      ),
    },
    {
      title: 'Published',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      render: (date: string) => (
        <div className="text-sm">
          {date ? new Date(date).toLocaleDateString() : 'Not published'}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: BlogPost) => (
        <Space>
          <Tooltip title="View">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => window.open(`/blog/${record.slug}`, '_blank')}
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

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchText.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || post.categories.includes(categoryFilter);
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Calculate stats
  const totalPosts = posts.length;
  const publishedPosts = posts.filter(p => p.status === 'published').length;
  const totalViews = posts.reduce((sum, p) => sum + p.views, 0);
  const totalEngagement = posts.reduce((sum, p) => sum + p.likes + p.comments + p.shares, 0);

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-0">Blog Management</Title>
          <p className="text-gray-600">Create and manage your blog content</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} size="large">
          Create Post
        </Button>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Posts"
              value={totalPosts}
              valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Published"
              value={publishedPosts}
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
              title="Engagement"
              value={totalEngagement}
              valueStyle={{ color: '#722ed1', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<HeartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4 items-center">
          <Search
            placeholder="Search blog posts..."
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
            <Option value="scheduled">Scheduled</Option>
            <Option value="archived">Archived</Option>
          </Select>
          <Select
            style={{ width: 150 }}
            value={categoryFilter}
            onChange={setCategoryFilter}
            placeholder="Filter by category"
          >
            <Option value="all">All Categories</Option>
            <Option value="Fashion">Fashion</Option>
            <Option value="Trends">Trends</Option>
            <Option value="Sustainability">Sustainability</Option>
            <Option value="Designers">Designers</Option>
            <Option value="Fashion Week">Fashion Week</Option>
          </Select>
        </div>
      </Card>

      {/* Blog Posts Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredPosts}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} posts`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Create/Edit Post Modal */}
      <Modal
        title={editingPost ? 'Edit Blog Post' : 'Create Blog Post'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={1000}
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          className="mt-4"
        >
          <Row gutter={[24, 0]}>
            <Col xs={24} lg={16}>
              <Form.Item
                name="title"
                label="Post Title"
                rules={[{ required: true, message: 'Please enter post title' }]}
              >
                <Input placeholder="Enter an engaging title" size="large" />
              </Form.Item>

              <Form.Item
                name="excerpt"
                label="Excerpt"
                rules={[{ required: true, message: 'Please enter excerpt' }]}
              >
                <TextArea
                  rows={3}
                  placeholder="Brief description of the post"
                  showCount
                  maxLength={200}
                />
              </Form.Item>

              <Form.Item label="Content" required>
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
                  <Option value="published">Published</Option>
                  <Option value="draft">Draft</Option>
                  <Option value="scheduled">Scheduled</Option>
                  <Option value="archived">Archived</Option>
                </Select>
              </Form.Item>

              <Form.Item name="publishedAt" label="Publish Date">
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item name="featuredImage" label="Featured Image URL">
                <Input placeholder="https://example.com/image.jpg" />
              </Form.Item>

              <Form.Item name="author" label="Author" initialValue="Admin">
                <Input />
              </Form.Item>

              <Form.Item name="categories" label="Categories">
                <Select mode="multiple" placeholder="Select categories">
                  <Option value="Fashion">Fashion</Option>
                  <Option value="Trends">Trends</Option>
                  <Option value="Sustainability">Sustainability</Option>
                  <Option value="Designers">Designers</Option>
                  <Option value="Fashion Week">Fashion Week</Option>
                  <Option value="Style Guide">Style Guide</Option>
                </Select>
              </Form.Item>

              <Form.Item name="tags" label="Tags">
                <Select
                  mode="tags"
                  placeholder="Add tags"
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item name="featured" valuePropName="checked">
                <Switch /> Featured Post
              </Form.Item>

              <Form.Item name="allowComments" valuePropName="checked" initialValue={true}>
                <Switch /> Allow Comments
              </Form.Item>

              {/* SEO Section */}
              <div className="border-t pt-4 mt-4">
                <h4 className="text-lg font-medium mb-3">SEO Settings</h4>
                
                <Form.Item name={['seo', 'metaTitle']} label="Meta Title">
                  <Input placeholder="SEO title (50-60 characters)" maxLength={60} showCount />
                </Form.Item>

                <Form.Item name={['seo', 'metaDescription']} label="Meta Description">
                  <TextArea
                    rows={3}
                    placeholder="SEO description (150-160 characters)"
                    maxLength={160}
                    showCount
                  />
                </Form.Item>

                <Form.Item name={['seo', 'keywords']} label="Keywords">
                  <Select
                    mode="tags"
                    placeholder="Add SEO keywords"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <div className="flex justify-end space-x-2 pt-6 border-t">
            <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingPost ? 'Update Post' : 'Create Post'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default BlogList;
