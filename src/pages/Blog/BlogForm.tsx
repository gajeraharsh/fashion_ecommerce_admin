import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  DatePicker,
  Switch,
  App,
  PageHeader,
} from 'antd';
import {
  SaveOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  status: 'published' | 'draft' | 'scheduled' | 'archived';
  featuredImage: string;
  categories: string[];
  tags: string[];
  views: number;
  featured: boolean;
  allowComments: boolean;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
}

const BlogForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [post, setPost] = useState<BlogPost | null>(null);
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  // Mock blog posts data for demo
  const mockPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Latest Fashion Trends 2024',
      excerpt: 'Discover the hottest fashion trends that will dominate 2024',
      content: 'Fashion trends are constantly evolving...',
      author: 'Fashion Editor',
      publishedAt: '2024-01-15T10:00:00Z',
      status: 'published',
      featuredImage: 'https://via.placeholder.com/800x400/007bff/ffffff?text=Fashion+Trends',
      categories: ['Fashion', 'Trends'],
      tags: ['2024', 'fashion', 'trends', 'style'],
      views: 1250,
      featured: true,
      allowComments: true,
      seo: {
        metaTitle: 'Latest Fashion Trends 2024 - Style Guide',
        metaDescription: 'Discover the hottest fashion trends that will dominate 2024. From sustainable fashion to bold colors.',
        keywords: ['fashion', 'trends', '2024', 'style', 'clothing'],
      },
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
    },
    // Add more mock data as needed
  ];

  useEffect(() => {
    if (isEditing) {
      // In a real app, fetch post by ID from API
      const foundPost = mockPosts.find(p => p.id === id);
      if (foundPost) {
        setPost(foundPost);
        setContent(foundPost.content);
        form.setFieldsValue({
          ...foundPost,
          publishedAt: foundPost.publishedAt ? dayjs(foundPost.publishedAt) : null,
        });
      }
    } else {
      // Set default values for new post
      form.setFieldsValue({
        status: 'draft',
        author: 'Admin',
        featured: false,
        allowComments: true,
      });
    }
  }, [id, isEditing, form]);

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      const postData = {
        ...values,
        content,
        publishedAt: values.publishedAt?.toISOString(),
        id: post?.id || `post_${Date.now()}`,
        views: post?.views || 0,
        createdAt: post?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // In a real app, make API call here
      console.log('Saving blog post:', postData);
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      message.success(isEditing ? 'Post updated successfully' : 'Post created successfully');
      navigate('/blog');
    } catch (error) {
      message.error('Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/blog');
  };

  return (
    <div className="p-6">
      <PageHeader
        onBack={handleCancel}
        title={isEditing ? 'Edit Blog Post' : 'Create Blog Post'}
        subTitle={isEditing ? `Editing: ${post?.title}` : 'Create a new blog post'}
        extra={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            icon={<SaveOutlined />}
            loading={loading}
            onClick={() => form.submit()}
          >
            {isEditing ? 'Update Post' : 'Create Post'}
          </Button>,
        ]}
      />

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
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
                <TextArea
                  rows={15}
                  placeholder="Enter blog post content..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </Form.Item>
            </Col>

            <Col xs={24} lg={8}>
              <Form.Item name="status" label="Status">
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

              <Form.Item name="author" label="Author">
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
                  <Option value="News">News</Option>
                  <Option value="Beauty">Beauty</Option>
                  <Option value="Lifestyle">Lifestyle</Option>
                </Select>
              </Form.Item>

              <Form.Item name="tags" label="Tags">
                <Select
                  mode="tags"
                  placeholder="Add tags"
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item name="featured" label="Featured Post" valuePropName="checked">
                <Switch />
              </Form.Item>

              <Form.Item name="allowComments" label="Allow Comments" valuePropName="checked">
                <Switch />
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

                <Form.Item name={['seo', 'canonicalUrl']} label="Canonical URL">
                  <Input placeholder="https://example.com/blog/post-slug" />
                </Form.Item>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default BlogForm;
