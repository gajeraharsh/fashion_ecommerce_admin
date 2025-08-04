import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Tag,
  Input,
  Select,
  Card,
  Avatar,
  Badge,
  Dropdown,
  Modal,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  EyeOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchProducts, fetchProductStats, deleteProductAsync, clearError } from '../../store/slices/productSlice';

const { Search } = Input;
const { Option } = Select;

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error, stats, totalCount } = useSelector((state: RootState) => state.products);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch products and stats on component mount
  useEffect(() => {
    const filters = {
      page: currentPage,
      limit: pageSize,
      search: searchText || undefined,
      isActive: statusFilter === 'all' ? undefined : statusFilter === 'live' ? 'true' : 'false',
      sortBy: 'createdAt',
      sortOrder: 'desc' as const,
    };
    
    dispatch(fetchProducts(filters));
    dispatch(fetchProductStats());
  }, [dispatch, currentPage, pageSize, searchText, statusFilter, categoryFilter]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Show error message if there's an error
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteProductAsync(id)).unwrap();
      message.success('Product deleted successfully');
      // Refresh the list
      const filters = {
        page: currentPage,
        limit: pageSize,
        search: searchText || undefined,
        isActive: statusFilter === 'all' ? undefined : statusFilter === 'live' ? 'true' : 'false',
        sortBy: 'createdAt',
        sortOrder: 'desc' as const,
      };
      dispatch(fetchProducts(filters));
    } catch (error) {
      message.error('Failed to delete product');
    }
  };

  const getStatusColor = (isActive: boolean, stockQuantity: number) => {
    if (stockQuantity === 0) return 'red';
    return isActive ? 'green' : 'orange';
  };

  const getStatusText = (isActive: boolean, stockQuantity: number) => {
    if (stockQuantity === 0) return 'Out of Stock';
    return isActive ? 'Active' : 'Inactive';
  };

  const columns = [
    {
      title: 'Product',
      key: 'product',
      render: (record: any) => (
        <div className="flex items-center space-x-3">
          <Avatar
            size={60}
            src={record.images?.[0]?.url || '/placeholder-product.png'}
            className="rounded-lg"
          />
          <div>
            <div className="font-medium text-gray-900">{record.name}</div>
            <div className="text-sm text-gray-500">{record.category?.name || 'No Category'}</div>
            <div className="flex space-x-1 mt-1">
              {record.tags?.slice(0, 2).map((tag: string) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      render: (sku: string) => <span className="font-mono text-sm">{sku || 'N/A'}</span>,
    },
    {
      title: 'Price',
      key: 'price',
      render: (record: any) => {
        const price = record.price || 0;
        const comparePrice = record.comparePrice;
        return (
          <div>
            <div className="font-medium">${price.toFixed(2)}</div>
            {comparePrice && comparePrice > price && (
              <div className="text-sm text-gray-500 line-through">${comparePrice.toFixed(2)}</div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Stock',
      key: 'stock',
      render: (record: any) => {
        const stock = record.stockQuantity || 0;
        return (
          <div className="text-center">
            <Badge
              count={stock}
              showZero
              style={{ backgroundColor: stock > 10 ? '#52c41a' : stock > 0 ? '#faad14' : '#ff4d4f' }}
            />
          </div>
        );
      },
    },
    {
      title: 'Status',
      key: 'status',
      render: (record: any) => (
        <Tag color={getStatusColor(record.isActive, record.stockQuantity)}>
          {getStatusText(record.isActive, record.stockQuantity)}
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
                onClick: () => {
                  // Add view logic
                },
              },
              {
                key: 'edit',
                label: 'Edit Product',
                icon: <EditOutlined />,
                onClick: () => {
                  navigate(`/products/edit/${record.id}`);
                },
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
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         (product.sku && product.sku.toLowerCase().includes(searchText.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'live' && product.isActive) ||
                         (statusFilter === 'draft' && !product.isActive);
    const matchesCategory = categoryFilter === 'all' || product.category?.name === categoryFilter;
    
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
            {stats?.activeProducts || products.filter(p => p.isActive).length}
          </div>
          <div className="text-gray-600">Active Products</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {stats?.featuredProducts || products.filter(p => p.isFeatured).length}
          </div>
          <div className="text-gray-600">Featured Products</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {stats?.outOfStockProducts || products.filter(p => p.stockQuantity === 0).length}
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
            <Option value="live">Active</Option>
            <Option value="draft">Inactive</Option>
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
            current: currentPage,
            pageSize: pageSize,
            total: totalCount,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} products`,
            onChange: (page, size) => {
              setCurrentPage(page);
              if (size !== pageSize) {
                setPageSize(size);
              }
            },
          }}
          className="overflow-x-auto"
        />
      </Card>
    </div>
  );
};

export default ProductList;