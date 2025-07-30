import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  Input,
  Select,
  Card,
  Avatar,
  Tooltip,
  Badge,
  Dropdown,
  Modal,
  Form,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  MoreOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setProducts, deleteProduct } from '../../store/slices/productSlice';

const { Search } = Input;
const { Option } = Select;

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state: RootState) => state.products);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockProducts = [
      {
        id: '1',
        name: 'Designer Evening Dress',
        description: 'Elegant evening dress perfect for special occasions',
        category: 'Clothing',
        subcategory: 'Dresses',
        variants: [
          {
            id: 'v1',
            size: 'M',
            color: 'Black',
            sku: 'DED-BLK-M',
            stock: 15,
            price: 299.99,
            discount: 10,
            images: ['https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=400'],
          },
        ],
        tags: ['evening', 'elegant', 'party'],
        status: 'live' as const,
        seo: {
          title: 'Designer Evening Dress - Fashion Store',
          description: 'Shop elegant evening dresses for special occasions',
          url: 'designer-evening-dress',
        },
        attributes: {
          material: 'Silk',
          fit: 'Slim',
          fabric: 'Premium',
        },
        faqs: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-05',
      },
      {
        id: '2',
        name: 'Casual Cotton T-Shirt',
        description: 'Comfortable cotton t-shirt for everyday wear',
        category: 'Clothing',
        subcategory: 'Tops',
        variants: [
          {
            id: 'v2',
            size: 'L',
            color: 'White',
            sku: 'CCT-WHT-L',
            stock: 25,
            price: 29.99,
            discount: 0,
            images: ['https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400'],
          },
        ],
        tags: ['casual', 'cotton', 'everyday'],
        status: 'live' as const,
        seo: {
          title: 'Casual Cotton T-Shirt - Fashion Store',
          description: 'Comfortable cotton t-shirts for daily wear',
          url: 'casual-cotton-tshirt',
        },
        attributes: {
          material: 'Cotton',
          fit: 'Regular',
          fabric: 'Soft',
        },
        faqs: [],
        createdAt: '2024-01-02',
        updatedAt: '2024-01-06',
      },
      {
        id: '3',
        name: 'Leather Handbag',
        description: 'Premium leather handbag with multiple compartments',
        category: 'Accessories',
        subcategory: 'Bags',
        variants: [
          {
            id: 'v3',
            size: 'One Size',
            color: 'Brown',
            sku: 'LHB-BRN-OS',
            stock: 8,
            price: 199.99,
            discount: 15,
            images: ['https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400'],
          },
        ],
        tags: ['leather', 'handbag', 'premium'],
        status: 'live' as const,
        seo: {
          title: 'Leather Handbag - Fashion Store',
          description: 'Premium leather handbags with style and functionality',
          url: 'leather-handbag',
        },
        attributes: {
          material: 'Genuine Leather',
          fit: 'N/A',
          fabric: 'Leather',
        },
        faqs: [],
        createdAt: '2024-01-03',
        updatedAt: '2024-01-07',
      },
    ];

    dispatch(setProducts(mockProducts));
  }, [dispatch]);

  const handleDelete = (id: string) => {
    dispatch(deleteProduct(id));
    message.success('Product deleted successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'green';
      case 'draft':
        return 'orange';
      case 'out_of_stock':
        return 'red';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Product',
      key: 'product',
      render: (record: any) => (
        <div className="flex items-center space-x-3">
          <Avatar
            size={60}
            src={record.variants[0]?.images[0]}
            className="rounded-lg"
          />
          <div>
            <div className="font-medium text-gray-900">{record.name}</div>
            <div className="text-sm text-gray-500">{record.category} • {record.subcategory}</div>
            <div className="flex space-x-1 mt-1">
              {record.tags.slice(0, 2).map((tag: string) => (
                <Tag key={tag} size="small">{tag}</Tag>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'SKU',
      dataIndex: ['variants', 0, 'sku'],
      key: 'sku',
      render: (sku: string) => <span className="font-mono text-sm">{sku}</span>,
    },
    {
      title: 'Price',
      key: 'price',
      render: (record: any) => {
        const variant = record.variants[0];
        const discountedPrice = variant.price - (variant.price * variant.discount / 100);
        return (
          <div>
            <div className="font-medium">${discountedPrice.toFixed(2)}</div>
            {variant.discount > 0 && (
              <div className="text-sm text-gray-500 line-through">${variant.price.toFixed(2)}</div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Stock',
      key: 'stock',
      render: (record: any) => {
        const stock = record.variants[0]?.stock || 0;
        return (
          <Badge
            count={stock}
            showZero
            style={{
              backgroundColor: stock > 10 ? '#52c41a' : stock > 0 ? '#faad14' : '#ff4d4f',
            }}
          />
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'view',
                label: 'View Details',
                icon: <EyeOutlined />,
                onClick: () => navigate(`/products/${record.id}`),
              },
              {
                key: 'edit',
                label: 'Edit Product',
                icon: <EditOutlined />,
                onClick: () => navigate(`/products/edit/${record.id}`),
              },
              {
                type: 'divider',
              },
              {
                key: 'delete',
                label: 'Delete Product',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => {
                  Modal.confirm({
                    title: 'Delete Product',
                    content: 'Are you sure you want to delete this product?',
                    onOk: () => handleDelete(record.id),
                  });
                },
              },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         product.variants[0]?.sku.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/products/add')}
          size="large"
        >
          Add New Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600">{products.length}</div>
          <div className="text-gray-600">Total Products</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {products.filter(p => p.status === 'live').length}
          </div>
          <div className="text-gray-600">Live Products</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {products.filter(p => p.status === 'draft').length}
          </div>
          <div className="text-gray-600">Draft Products</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {products.filter(p => p.variants[0]?.stock === 0).length}
          </div>
          <div className="text-gray-600">Out of Stock</div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4 items-center">
          <Search
            placeholder="Search products, SKU..."
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
            <Option value="live">Live</Option>
            <Option value="draft">Draft</Option>
            <Option value="out_of_stock">Out of Stock</Option>
          </Select>
          <Select
            style={{ width: 150 }}
            value={categoryFilter}
            onChange={setCategoryFilter}
            placeholder="Filter by category"
          >
            <Option value="all">All Categories</Option>
            <Option value="Clothing">Clothing</Option>
            <Option value="Accessories">Accessories</Option>
            <Option value="Footwear">Footwear</Option>
            <Option value="Bags">Bags</Option>
          </Select>
          <Button
            icon={<FilterOutlined />}
            onClick={() => {
              setSearchText('');
              setStatusFilter('all');
              setCategoryFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Products Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} products`,
          }}
          className="overflow-x-auto"
        />
      </Card>
    </div>
  );
};

export default ProductList;