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
  App,
  Typography,
  Space,
} from 'antd';
import {
  SaveOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

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
}

const BannerForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<Banner | null>(null);
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  // Mock banners data for demo
  const mockBanners: Banner[] = [
    {
      id: '1',
      name: 'Summer Sale Hero',
      title: 'Summer Sale - Up to 50% Off',
      description: 'Get the best deals on summer collections',
      imageUrl: 'https://via.placeholder.com/1200x400/007bff/ffffff?text=Summer+Sale',
      linkUrl: '/summer-sale',
      linkText: 'Shop Now',
      position: 'hero',
      status: 'active',
      priority: 1,
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      targetAudience: 'all',
      devices: ['desktop', 'mobile'],
      locations: ['US', 'CA'],
      clicks: 1245,
      impressions: 15600,
      conversionRate: 7.98,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
    },
    // Add more mock data as needed
  ];

  useEffect(() => {
    if (isEditing) {
      // In a real app, fetch banner by ID from API
      const foundBanner = mockBanners.find(b => b.id === id);
      if (foundBanner) {
        setBanner(foundBanner);
        form.setFieldsValue({
          ...foundBanner,
          dateRange: [dayjs(foundBanner.startDate), dayjs(foundBanner.endDate)]
        });
      }
    }
  }, [id, isEditing, form]);

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      const formData = {
        ...values,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
      };

      // In a real app, make API call here
      console.log('Saving banner:', formData);
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      message.success(isEditing ? 'Banner updated successfully' : 'Banner created successfully');
      navigate('/banners');
    } catch (error) {
      message.error('Failed to save banner');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/banners');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Space>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={handleCancel}
                type="text"
              />
              <div>
                <Typography.Title level={3} className="!mb-0">
                  {isEditing ? 'Edit Banner' : 'Create Banner'}
                </Typography.Title>
                <Typography.Text type="secondary">
                  {isEditing ? `Editing banner: ${banner?.name}` : 'Create a new banner for your website'}
                </Typography.Text>
              </div>
            </Space>
          </div>
          <Space>
            <Button onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={loading}
              onClick={() => form.submit()}
            >
              {isEditing ? 'Update Banner' : 'Create Banner'}
            </Button>
          </Space>
        </div>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            status: 'inactive',
            priority: 1,
            targetAudience: 'all',
            devices: ['desktop', 'mobile'],
          }}
        >
          <Row gutter={[24, 0]}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="name"
                label="Banner Name"
                rules={[{ required: true, message: 'Please enter banner name' }]}
              >
                <Input placeholder="Enter banner name" />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
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
            <Input.TextArea rows={3} placeholder="Enter banner description" />
          </Form.Item>

          <Row gutter={[24, 0]}>
            <Col xs={24} lg={12}>
              <Form.Item name="linkUrl" label="Link URL">
                <Input placeholder="https://example.com/page" />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item name="linkText" label="Link Text">
                <Input placeholder="Shop Now" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="imageUrl" label="Banner Image URL">
            <Input placeholder="https://example.com/banner.jpg" />
          </Form.Item>

          <Form.Item name="mobileImageUrl" label="Mobile Image URL (Optional)">
            <Input placeholder="https://example.com/mobile-banner.jpg" />
          </Form.Item>

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

          <Row gutter={[24, 0]}>
            <Col xs={24} lg={8}>
              <Form.Item name="priority" label="Priority">
                <Select>
                  <Option value={1}>High (1)</Option>
                  <Option value={2}>Medium (2)</Option>
                  <Option value={3}>Low (3)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} lg={8}>
              <Form.Item name="targetAudience" label="Target Audience">
                <Select>
                  <Option value="all">All Users</Option>
                  <Option value="new_users">New Users</Option>
                  <Option value="returning_users">Returning Users</Option>
                  <Option value="vip_users">VIP Users</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} lg={8}>
              <Form.Item name="status" label="Status">
                <Select>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                  <Option value="scheduled">Scheduled</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="devices" label="Target Devices">
            <Select mode="multiple" placeholder="Select target devices">
              <Option value="desktop">Desktop</Option>
              <Option value="mobile">Mobile</Option>
              <Option value="tablet">Tablet</Option>
            </Select>
          </Form.Item>

          <Form.Item name="locations" label="Target Locations">
            <Select mode="multiple" placeholder="Select target locations">
              <Option value="US">United States</Option>
              <Option value="CA">Canada</Option>
              <Option value="UK">United Kingdom</Option>
              <Option value="AU">Australia</Option>
              <Option value="DE">Germany</Option>
              <Option value="FR">France</Option>
            </Select>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default BannerForm;
