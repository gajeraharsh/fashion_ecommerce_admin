import React from 'react';
import { Card, Row, Col, Table, Button, Tag, Typography, Space } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
  GlobalOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const PageManager: React.FC = () => {
  const mockPages = [
    {
      key: '1',
      title: 'About Us',
      slug: '/about',
      status: 'published',
      lastModified: '2024-01-07',
      views: 1245,
    },
    {
      key: '2',
      title: 'Privacy Policy',
      slug: '/privacy',
      status: 'published',
      lastModified: '2024-01-05',
      views: 892,
    },
    {
      key: '3',
      title: 'Terms of Service',
      slug: '/terms',
      status: 'published',
      lastModified: '2024-01-03',
      views: 634,
    },
    {
      key: '4',
      title: 'Shipping Information',
      slug: '/shipping',
      status: 'draft',
      lastModified: '2024-01-06',
      views: 0,
    },
    {
      key: '5',
      title: 'Size Guide',
      slug: '/size-guide',
      status: 'published',
      lastModified: '2024-01-04',
      views: 2156,
    },
  ];

  const columns = [
    {
      title: 'Page Title',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: any) => (
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm text-gray-500">{record.slug}</div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'published' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Views',
      dataIndex: 'views',
      key: 'views',
      render: (views: number) => views.toLocaleString(),
    },
    {
      title: 'Last Modified',
      dataIndex: 'lastModified',
      key: 'lastModified',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} />
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-0">Page Management</Title>
          <p className="text-gray-600">Manage static pages and content</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large">
          Create Page
        </Button>
      </div>

      {/* Quick Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-blue-600">{mockPages.length}</div>
            <div className="text-gray-600">Total Pages</div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {mockPages.filter(p => p.status === 'published').length}
            </div>
            <div className="text-gray-600">Published</div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {mockPages.filter(p => p.status === 'draft').length}
            </div>
            <div className="text-gray-600">Drafts</div>
          </Card>
        </Col>
      </Row>

      {/* Pages Table */}
      <Card title="All Pages">
        <Table
          columns={columns}
          dataSource={mockPages}
          pagination={false}
        />
      </Card>

      {/* Common Pages */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Essential Pages" extra={<SettingOutlined />}>
            <div className="space-y-3">
              <Button block icon={<FileTextOutlined />}>About Us</Button>
              <Button block icon={<FileTextOutlined />}>Privacy Policy</Button>
              <Button block icon={<FileTextOutlined />}>Terms of Service</Button>
              <Button block icon={<FileTextOutlined />}>Contact Us</Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="E-commerce Pages" extra={<GlobalOutlined />}>
            <div className="space-y-3">
              <Button block icon={<FileTextOutlined />}>Shipping Info</Button>
              <Button block icon={<FileTextOutlined />}>Return Policy</Button>
              <Button block icon={<FileTextOutlined />}>Size Guide</Button>
              <Button block icon={<FileTextOutlined />}>FAQ</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PageManager;
