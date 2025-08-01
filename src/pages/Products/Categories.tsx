import React, { useState } from 'react';
import { Card, Row, Col, Tree, Button, Typography, Space, Table, Tag, Modal, Form, Input, App } from 'antd';
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
  const { message } = App.useApp();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['women', 'men']);
  const [form] = Form.useForm();

  const handleExpandAll = () => {
    const allKeys = ['women', 'men', 'accessories', 'women-clothing', 'women-shoes', 'women-accessories', 'men-clothing', 'men-shoes', 'men-accessories'];
    setExpandedKeys(allKeys);
  };

  const handleEdit = (record: any) => {
    setEditingCategory(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (record: any) => {
    Modal.confirm({
      title: 'Delete Category',
      content: `Are you sure you want to delete "${record.name}"? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        message.success(`Category "${record.name}" deleted successfully`);
      },
    });
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      message.success(editingCategory ? 'Category updated successfully' : 'Category created successfully');
      setIsModalVisible(false);
      setEditingCategory(null);
      form.resetFields();
    });
  };

  const handleQuickAction = (action: string) => {
    switch(action) {
      case 'add-main':
        setEditingCategory(null);
        form.resetFields();
        setIsModalVisible(true);
        break;
      case 'add-sub':
        message.info('Select a parent category first');
        break;
      case 'reorder':
        message.info('Drag and drop functionality enabled');
        break;
      case 'bulk-edit':
        message.info('Bulk edit mode activated');
        break;
      default:
        message.info('Feature coming soon');
    }
  };
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
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
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
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => handleQuickAction('add-main')}>
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
          <Card title="Category Hierarchy" extra={<Button size="small" onClick={handleExpandAll}>Expand All</Button>}>
            <Tree
              showIcon
              expandedKeys={expandedKeys}
              onExpand={setExpandedKeys}
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
              <Button block icon={<PlusOutlined />} onClick={() => handleQuickAction('add-main')}>Add Main Category</Button>
              <Button block icon={<AppstoreOutlined />} onClick={() => handleQuickAction('add-sub')}>Add Subcategory</Button>
              <Button block icon={<DragOutlined />} onClick={() => handleQuickAction('reorder')}>Reorder Categories</Button>
              <Button block icon={<EditOutlined />} onClick={() => handleQuickAction('bulk-edit')}>Bulk Edit</Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Category Templates">
            <div className="space-y-3">
              <Button block onClick={() => handleQuickAction('fashion-template')}>Fashion Store Template</Button>
              <Button block onClick={() => handleQuickAction('electronics-template')}>Electronics Template</Button>
              <Button block onClick={() => handleQuickAction('home-template')}>Home & Garden Template</Button>
              <Button block onClick={() => handleQuickAction('custom-template')}>Custom Template</Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Category Modal */}
      <Modal
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingCategory(null);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: 'Please enter category name' }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={3} placeholder="Enter category description" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            initialValue="active"
          >
            <select className="w-full p-2 border rounded">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Categories;
