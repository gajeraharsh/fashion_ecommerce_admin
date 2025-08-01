import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Avatar,
  Statistic,
  Row,
  Col,
  Modal,
  Form,
  DatePicker,
  Upload,
  message,
  Tabs,
  Image,
} from 'antd';
import {
  InstagramOutlined,
  HeartOutlined,
  MessageOutlined,
  ShareAltOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;

interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  hashtags: string[];
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  engagement: number;
  postDate: string;
  status: 'published' | 'draft' | 'scheduled';
  type: 'photo' | 'video' | 'carousel';
}

const InstagramFeed: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data for Instagram posts
  const mockPosts: InstagramPost[] = [
    {
      id: '1',
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
      caption: 'New summer collection is here! ☀️ #fashion #summer #style',
      hashtags: ['fashion', 'summer', 'style', 'trendy'],
      likes: 1234,
      comments: 89,
      shares: 45,
      reach: 5678,
      engagement: 8.5,
      postDate: '2024-01-15',
      status: 'published',
      type: 'photo',
    },
    {
      id: '2',
      imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
      caption: 'Behind the scenes of our latest photoshoot 📸 #bts #photoshoot',
      hashtags: ['bts', 'photoshoot', 'fashion', 'model'],
      likes: 892,
      comments: 67,
      shares: 23,
      reach: 3456,
      engagement: 7.2,
      postDate: '2024-01-14',
      status: 'published',
      type: 'carousel',
    },
    {
      id: '3',
      imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400',
      caption: 'Sustainable fashion for a better tomorrow 🌱 #sustainable #ecofriendly',
      hashtags: ['sustainable', 'ecofriendly', 'fashion', 'green'],
      likes: 1567,
      comments: 123,
      shares: 78,
      reach: 7890,
      engagement: 9.1,
      postDate: '2024-01-13',
      status: 'published',
      type: 'video',
    },
    {
      id: '4',
      imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
      caption: 'Coming soon: Our winter collection preview ❄️',
      hashtags: ['winter', 'preview', 'comingsoon', 'fashion'],
      likes: 0,
      comments: 0,
      shares: 0,
      reach: 0,
      engagement: 0,
      postDate: '2024-01-20',
      status: 'scheduled',
      type: 'photo',
    },
  ];

  const [posts, setPosts] = useState<InstagramPost[]>(mockPosts);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.caption.toLowerCase().includes(searchText.toLowerCase()) ||
      post.hashtags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns: ColumnsType<InstagramPost> = [
    {
      title: 'Post',
      dataIndex: 'imageUrl',
      key: 'image',
      width: 80,
      render: (imageUrl: string, record: InstagramPost) => (
        <Avatar 
          size={60} 
          src={<Image src={imageUrl} preview={false} />}
          shape="square"
        />
      ),
    },
    {
      title: 'Caption',
      dataIndex: 'caption',
      key: 'caption',
      ellipsis: true,
      render: (caption: string) => (
        <div className="max-w-xs">
          {caption.length > 50 ? `${caption.substring(0, 50)}...` : caption}
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type: string) => (
        <Tag color={type === 'video' ? 'red' : type === 'carousel' ? 'blue' : 'green'}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'published' ? 'green' : status === 'scheduled' ? 'orange' : 'default'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Engagement',
      key: 'engagement',
      width: 120,
      render: (_, record: InstagramPost) => (
        <Space direction="vertical" size="small">
          <div className="flex items-center gap-1">
            <HeartOutlined className="text-red-500" />
            <span className="text-sm">{record.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageOutlined className="text-blue-500" />
            <span className="text-sm">{record.comments}</span>
          </div>
        </Space>
      ),
    },
    {
      title: 'Reach',
      dataIndex: 'reach',
      key: 'reach',
      width: 80,
      render: (reach: number) => reach.toLocaleString(),
    },
    {
      title: 'Date',
      dataIndex: 'postDate',
      key: 'postDate',
      width: 100,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record: InstagramPost) => (
        <Space>
          <Button 
            type="link" 
            size="small"
            onClick={() => {
              setSelectedPost(record);
              setIsModalVisible(true);
            }}
          >
            <EyeOutlined />
          </Button>
          <Button type="link" size="small">
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const handleCreatePost = () => {
    setSelectedPost(null);
    setIsModalVisible(true);
  };

  const totalEngagement = posts.reduce((sum, post) => sum + post.likes + post.comments, 0);
  const totalReach = posts.reduce((sum, post) => sum + post.reach, 0);
  const avgEngagementRate = posts.length > 0 ? 
    posts.reduce((sum, post) => sum + post.engagement, 0) / posts.length : 0;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <InstagramOutlined className="text-pink-500" />
          Instagram Feed Management
        </h1>
        <p className="text-gray-600">Manage your Instagram posts and track engagement metrics</p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Posts"
              value={posts.length}
              prefix={<InstagramOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Engagement"
              value={totalEngagement}
              prefix={<HeartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Reach"
              value={totalReach}
              prefix={<EyeOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Avg. Engagement Rate"
              value={avgEngagementRate}
              precision={1}
              suffix="%"
              prefix={<ShareAltOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Controls */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <Search
              placeholder="Search posts..."
              allowClear
              style={{ width: 250 }}
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 120 }}
            >
              <Option value="all">All Status</Option>
              <Option value="published">Published</Option>
              <Option value="scheduled">Scheduled</Option>
              <Option value="draft">Draft</Option>
            </Select>
          </div>
          <Button type="primary" onClick={handleCreatePost} icon={<PlusOutlined />}>
            Create Post
          </Button>
        </div>
      </Card>

      {/* Posts Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredPosts}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredPosts.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} posts`,
          }}
        />
      </Card>

      {/* Post Detail/Create Modal */}
      <Modal
        title={selectedPost ? "Post Details" : "Create New Post"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        footer={null}
      >
        <Tabs defaultActiveKey="details">
          <TabPane tab="Post Details" key="details">
            {selectedPost ? (
              <div className="space-y-4">
                <div className="text-center">
                  <Image
                    src={selectedPost.imageUrl}
                    alt="Post"
                    style={{ maxWidth: '300px', maxHeight: '300px' }}
                  />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Caption:</h4>
                  <p>{selectedPost.caption}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Hashtags:</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedPost.hashtags.map((tag, index) => (
                      <Tag key={index} color="blue">#{tag}</Tag>
                    ))}
                  </div>
                </div>
                <Row gutter={16}>
                  <Col span={8}>
                    <Statistic title="Likes" value={selectedPost.likes} />
                  </Col>
                  <Col span={8}>
                    <Statistic title="Comments" value={selectedPost.comments} />
                  </Col>
                  <Col span={8}>
                    <Statistic title="Shares" value={selectedPost.shares} />
                  </Col>
                </Row>
              </div>
            ) : (
              <Form layout="vertical">
                <Form.Item label="Post Image/Video">
                  <Upload.Dragger>
                    <p className="ant-upload-drag-icon">
                      <UploadOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to upload</p>
                    <p className="ant-upload-hint">Support for images and videos</p>
                  </Upload.Dragger>
                </Form.Item>
                <Form.Item label="Caption">
                  <Input.TextArea rows={4} placeholder="Write your caption..." />
                </Form.Item>
                <Form.Item label="Hashtags">
                  <Input placeholder="Enter hashtags separated by commas" />
                </Form.Item>
                <Form.Item label="Schedule Date">
                  <DatePicker showTime />
                </Form.Item>
                <Form.Item label="Post Type">
                  <Select placeholder="Select post type">
                    <Option value="photo">Photo</Option>
                    <Option value="video">Video</Option>
                    <Option value="carousel">Carousel</Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button type="primary">Save as Draft</Button>
                    <Button type="primary">Schedule Post</Button>
                    <Button>Publish Now</Button>
                  </Space>
                </Form.Item>
              </Form>
            )}
          </TabPane>
          <TabPane tab="Analytics" key="analytics">
            {selectedPost && (
              <div className="space-y-4">
                <Row gutter={16}>
                  <Col span={12}>
                    <Card>
                      <Statistic
                        title="Engagement Rate"
                        value={selectedPost.engagement}
                        precision={1}
                        suffix="%"
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card>
                      <Statistic
                        title="Reach"
                        value={selectedPost.reach}
                      />
                    </Card>
                  </Col>
                </Row>
                <div className="text-center text-gray-500 mt-8">
                  📊 Detailed analytics charts would be implemented here
                </div>
              </div>
            )}
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default InstagramFeed;
