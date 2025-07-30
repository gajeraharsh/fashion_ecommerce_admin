import React from 'react';
import { Card, Row, Col, Tree, Button, Typography, Space, Table, Tag, Modal, Form, Input } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
  AppstoreOutlined,
  DragOutlined,
} from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;

const Categories: React.FC = () => {
  const categoryData = [
    {
      title: 'Women\'s Fashion',
      key: 'women',
      icon: <FolderOutlined />,
      children: [
        {
          title: 'Clothing',
          key: 'women-clothing',
          children: [
            { title: 'Dresses', key: 'women-dresses' },
            { title: 'Tops', key: 'women-tops' },
            { title: 'Bottoms', key: 'women-bottoms' },
            { title: 'Outerwear', key: 'women-outerwear' },
          ],
        },
        {
          title: 'Shoes',
          key: 'women-shoes',
          children: [
            { title: 'Heels', key: 'women-heels' },
            { title: 'Flats', key: 'women-flats' },
            { title: 'Sneakers', key: 'women-sneakers' },
          ],
        },
        {
          title: 'Accessories',
          key: 'women-accessories',
          children: [
            { title: 'Handbags', key: 'women-handbags' },
            { title: 'Jewelry', key: 'women-jewelry' },
            { title: 'Scarves', key: 'women-scarves' },
          ],
        },
      ],
    },
    {
      title: 'Men\'s Fashion',
      key: 'men',
      icon: <FolderOutlined />,
      children: [
        {
          title: 'Clothing',
          key: 'men-clothing',
          children: [
            { title: 'Shirts', key: 'men-shirts' },
            { title: 'Pants', key: 'men-pants' },
            { title: 'Suits', key: 'men-suits' },
            { title: 'Jackets', key: 'men-jackets' },
          ],
        },
        {
          title: 'Shoes',
          key: 'men-shoes',
          children: [
            { title: 'Dress Shoes', key: 'men-dress-shoes' },
            { title: 'Casual Shoes', key: 'men-casual-shoes' },
            { title: 'Sneakers', key: 'men-sneakers' },
          ],
        },
      ],
    },
    {
      title: 'Accessories',
      key: 'accessories',
      icon: <FolderOutlined />,
      children: [
        { title: 'Watches', key: 'watches' },
        { title: 'Sunglasses', key: 'sunglasses' },
        { title: 'Bags', key: 'bags' },
        { title: 'Wallets', key: 'wallets' },
      ],
    },
  ];

  const flatCategories = [
    { key: '1', name: 'Women\'s Fashion', parent: '-', products: 245, status: 'active', order: 1 },
    { key: '2', name: 'Dresses', parent: 'Women\'s Fashion', products: 89, status: 'active', order: 1 },
    { key: '3', name: 'Tops', parent: 'Women\'s Fashion', products: 67, status: 'active', order: 2 },
    { key: '4', name: 'Men\'s Fashion', parent: '-', products: 178, status: 'active', order: 2 },
    { key: '5', name: 'Shirts', parent: 'Men\'s Fashion', products: 45, status: 'active', order: 1 },
    { key: '6', name: 'Accessories', parent: '-', products: 123, status: 'active', order: 3 },
  ];

  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: any) => (
        <div className="flex items-center space-x-2">
          {record.parent === '-' ? <FolderOutlined /> : <AppstoreOutlined />}
          <span className={record.parent === '-' ? 'font-semibold' : 'ml-4'}>{name}</span>
        </div>
      ),
    },
    {
      title: 'Parent Category',
      dataIndex: 'parent',
      key: 'parent',
      render: (parent: string) => parent === '-' ? <Tag color="blue">Root</Tag> : parent,
    },
    {
      title: 'Products',
      dataIndex: 'products',
      key: 'products',
      render: (count: number) => (
        <div className="text-center">
          <div className="text-lg font-semibold">{count}</div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
      render: (order: number) => (
        <div className="flex items-center space-x-2">
          <DragOutlined className="text-gray-400" />
          <span>{order}</span>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
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
          <Title level={2} className="mb-0">Product Categories</Title>
          <p className="text-gray-600">Organize your product catalog with categories</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large">
          Add Category
        </Button>
      </div>

      {/* Category Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-blue-600">3</div>
            <div className="text-gray-600">Main Categories</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-green-600">15</div>
            <div className="text-gray-600">Subcategories</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-purple-600">546</div>
            <div className="text-gray-600">Total Products</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-orange-600">4</div>
            <div className="text-gray-600">Max Depth</div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Category Tree */}
        <Col xs={24} lg={12}>
          <Card title="Category Hierarchy" extra={<Button size="small">Expand All</Button>}>
            <Tree
              showIcon
              defaultExpandAll
              defaultSelectedKeys={['women']}
              treeData={categoryData}
              className="mt-4"
            />
          </Card>
        </Col>

        {/* Category List */}
        <Col xs={24} lg={12}>
          <Card title="Category Management">
            <Table
              columns={columns}
              dataSource={flatCategories}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Category Performance */}
      <Card title="Category Performance">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card size="small" className="text-center">
              <div className="text-lg font-semibold">Women's Fashion</div>
              <div className="text-2xl font-bold text-pink-600">245</div>
              <div className="text-sm text-gray-500">products</div>
              <div className="text-sm text-green-600">+12.5% this month</div>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small" className="text-center">
              <div className="text-lg font-semibold">Men's Fashion</div>
              <div className="text-2xl font-bold text-blue-600">178</div>
              <div className="text-sm text-gray-500">products</div>
              <div className="text-sm text-green-600">+8.3% this month</div>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small" className="text-center">
              <div className="text-lg font-semibold">Accessories</div>
              <div className="text-2xl font-bold text-orange-600">123</div>
              <div className="text-sm text-gray-500">products</div>
              <div className="text-sm text-green-600">+15.7% this month</div>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Quick Actions */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Quick Actions">
            <div className="space-y-3">
              <Button block icon={<PlusOutlined />}>Add Main Category</Button>
              <Button block icon={<AppstoreOutlined />}>Add Subcategory</Button>
              <Button block icon={<DragOutlined />}>Reorder Categories</Button>
              <Button block icon={<EditOutlined />}>Bulk Edit</Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Category Templates">
            <div className="space-y-3">
              <Button block>Fashion Store Template</Button>
              <Button block>Electronics Template</Button>
              <Button block>Home & Garden Template</Button>
              <Button block>Custom Template</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Categories;
