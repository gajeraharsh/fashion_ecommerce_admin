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
  Statistic,
  Modal,
  Form,
  InputNumber,
  message,
  Alert,
  Progress,
  Tooltip,
  Badge,
  Tabs,
  DatePicker,
  Timeline,
  List,
  Avatar,
  Dropdown,
  Drawer,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  WarningOutlined,
  AlertOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  TruckOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileExcelOutlined,
  SyncOutlined,
  BellOutlined,
  FilterOutlined,
  DollarOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setInventory, updateInventoryItem, addPurchaseOrder } from '../../store/slices/inventorySlice';

const { Search } = Input;
const { Option } = Select;
// Using modern Tabs API

interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  costPrice: number;
  sellingPrice: number;
  supplier: string;
  supplierId: string;
  location: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
  lastRestocked: string;
  expiryDate?: string;
  batchNumber?: string;
  totalValue: number;
  reservedStock: number;
  availableStock: number;
  image?: string;
  movements: Array<{
    id: string;
    type: 'in' | 'out' | 'adjustment';
    quantity: number;
    reason: string;
    date: string;
    reference?: string;
  }>;
}

interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  items: Array<{
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }>;
  status: 'draft' | 'sent' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  orderDate: string;
  expectedDate?: string;
  deliveredDate?: string;
  notes?: string;
}

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: string;
  leadTime: number;
  rating: number;
  status: 'active' | 'inactive';
}

const InventoryList: React.FC = () => {
  const dispatch = useDispatch();
  const { inventory, purchaseOrders, suppliers, loading } = useSelector((state: RootState) => state.inventory);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [restockModalVisible, setRestockModalVisible] = useState(false);
  const [adjustmentModalVisible, setAdjustmentModalVisible] = useState(false);
  const [createPOVisible, setCreatePOVisible] = useState(false);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('inventory');

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockInventory: InventoryItem[] = [
      {
        id: 'inv_001',
        productId: 'p1',
        productName: 'Designer Evening Dress',
        sku: 'DED-BLK-M',
        category: 'Clothing',
        currentStock: 5,
        minStock: 10,
        maxStock: 100,
        costPrice: 150.00,
        sellingPrice: 299.99,
        supplier: 'Fashion House Inc.',
        supplierId: 'sup_001',
        location: 'Warehouse A - Aisle 1',
        status: 'low_stock',
        lastRestocked: '2024-01-01',
        totalValue: 750.00,
        reservedStock: 2,
        availableStock: 3,
        image: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=100',
        movements: [
          {
            id: 'mov_001',
            type: 'in',
            quantity: 20,
            reason: 'Purchase Order #PO-001',
            date: '2024-01-01',
            reference: 'PO-001',
          },
          {
            id: 'mov_002',
            type: 'out',
            quantity: 15,
            reason: 'Sales',
            date: '2024-01-05',
          },
        ],
      },
      {
        id: 'inv_002',
        productId: 'p2',
        productName: 'Casual Cotton T-Shirt',
        sku: 'CCT-WHT-L',
        category: 'Clothing',
        currentStock: 45,
        minStock: 20,
        maxStock: 200,
        costPrice: 15.00,
        sellingPrice: 29.99,
        supplier: 'Cotton Co.',
        supplierId: 'sup_002',
        location: 'Warehouse B - Aisle 3',
        status: 'in_stock',
        lastRestocked: '2024-01-03',
        totalValue: 675.00,
        reservedStock: 5,
        availableStock: 40,
        image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=100',
        movements: [
          {
            id: 'mov_003',
            type: 'in',
            quantity: 50,
            reason: 'Purchase Order #PO-002',
            date: '2024-01-03',
            reference: 'PO-002',
          },
        ],
      },
      {
        id: 'inv_003',
        productId: 'p3',
        productName: 'Leather Handbag',
        sku: 'LHB-BRN-OS',
        category: 'Accessories',
        currentStock: 0,
        minStock: 5,
        maxStock: 50,
        costPrice: 100.00,
        sellingPrice: 199.99,
        supplier: 'Leather Works Ltd.',
        supplierId: 'sup_003',
        location: 'Warehouse A - Aisle 5',
        status: 'out_of_stock',
        lastRestocked: '2023-12-15',
        totalValue: 0,
        reservedStock: 0,
        availableStock: 0,
        image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=100',
        movements: [
          {
            id: 'mov_004',
            type: 'out',
            quantity: 8,
            reason: 'Sales',
            date: '2024-01-06',
          },
        ],
      },
    ];

    const mockPurchaseOrders: PurchaseOrder[] = [
      {
        id: 'PO-001',
        supplierId: 'sup_001',
        supplierName: 'Fashion House Inc.',
        items: [
          {
            productId: 'p1',
            productName: 'Designer Evening Dress',
            sku: 'DED-BLK-M',
            quantity: 20,
            unitCost: 150.00,
            totalCost: 3000.00,
          },
        ],
        status: 'delivered',
        totalAmount: 3000.00,
        orderDate: '2023-12-28',
        expectedDate: '2024-01-05',
        deliveredDate: '2024-01-01',
      },
      {
        id: 'PO-002',
        supplierId: 'sup_002',
        supplierName: 'Cotton Co.',
        items: [
          {
            productId: 'p2',
            productName: 'Casual Cotton T-Shirt',
            sku: 'CCT-WHT-L',
            quantity: 50,
            unitCost: 15.00,
            totalCost: 750.00,
          },
        ],
        status: 'shipped',
        totalAmount: 750.00,
        orderDate: '2024-01-01',
        expectedDate: '2024-01-10',
      },
    ];

    const mockSuppliers: Supplier[] = [
      {
        id: 'sup_001',
        name: 'Fashion House Inc.',
        contactPerson: 'John Smith',
        email: 'john@fashionhouse.com',
        phone: '+1-555-0101',
        address: '123 Fashion Ave, New York, NY 10001',
        paymentTerms: 'Net 30',
        leadTime: 7,
        rating: 4.5,
        status: 'active',
      },
      {
        id: 'sup_002',
        name: 'Cotton Co.',
        contactPerson: 'Sarah Johnson',
        email: 'sarah@cottonco.com',
        phone: '+1-555-0102',
        address: '456 Cotton St, Los Angeles, CA 90210',
        paymentTerms: 'Net 15',
        leadTime: 5,
        rating: 4.8,
        status: 'active',
      },
      {
        id: 'sup_003',
        name: 'Leather Works Ltd.',
        contactPerson: 'Mike Brown',
        email: 'mike@leatherworks.com',
        phone: '+1-555-0103',
        address: '789 Leather Ln, Chicago, IL 60601',
        paymentTerms: 'Net 45',
        leadTime: 14,
        rating: 4.2,
        status: 'active',
      },
    ];

    dispatch(setInventory({ inventory: mockInventory, purchaseOrders: mockPurchaseOrders, suppliers: mockSuppliers }));
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    const colors = {
      in_stock: 'green',
      low_stock: 'orange',
      out_of_stock: 'red',
      discontinued: 'gray',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      in_stock: <CheckCircleOutlined />,
      low_stock: <WarningOutlined />,
      out_of_stock: <AlertOutlined />,
      discontinued: <ExclamationCircleOutlined />,
    };
    return icons[status as keyof typeof icons] || <ExclamationCircleOutlined />;
  };

  const getPOStatusColor = (status: string) => {
    const colors = {
      draft: 'gray',
      sent: 'blue',
      confirmed: 'orange',
      shipped: 'purple',
      delivered: 'green',
      cancelled: 'red',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const handleRestock = (values: any) => {
    if (!selectedItem) return;

    const restockData = {
      ...selectedItem,
      currentStock: selectedItem.currentStock + values.quantity,
      availableStock: selectedItem.availableStock + values.quantity,
      totalValue: (selectedItem.currentStock + values.quantity) * selectedItem.costPrice,
      lastRestocked: new Date().toISOString(),
      movements: [
        ...selectedItem.movements,
        {
          id: `mov_${Date.now()}`,
          type: 'in' as const,
          quantity: values.quantity,
          reason: values.reason || 'Manual Restock',
          date: new Date().toISOString(),
          reference: values.reference,
        },
      ],
    };

    dispatch(updateInventoryItem(restockData));
    message.success('Inventory restocked successfully');
    setRestockModalVisible(false);
    setDetailsVisible(false);
    form.resetFields();
  };

  const handleAdjustment = (values: any) => {
    if (!selectedItem) return;

    const newStock = values.adjustment_type === 'increase' 
      ? selectedItem.currentStock + values.quantity
      : selectedItem.currentStock - values.quantity;

    const adjustmentData = {
      ...selectedItem,
      currentStock: Math.max(0, newStock),
      availableStock: Math.max(0, selectedItem.availableStock + (values.adjustment_type === 'increase' ? values.quantity : -values.quantity)),
      totalValue: Math.max(0, newStock) * selectedItem.costPrice,
      movements: [
        ...selectedItem.movements,
        {
          id: `mov_${Date.now()}`,
          type: 'adjustment' as const,
          quantity: values.adjustment_type === 'increase' ? values.quantity : -values.quantity,
          reason: values.reason || 'Stock Adjustment',
          date: new Date().toISOString(),
        },
      ],
    };

    dispatch(updateInventoryItem(adjustmentData));
    message.success('Stock adjustment completed');
    setAdjustmentModalVisible(false);
    setDetailsVisible(false);
    form.resetFields();
  };

  const showItemDetails = (item: InventoryItem) => {
    setSelectedItem(item);
    setDetailsVisible(true);
  };

  const inventoryColumns = [
    {
      title: 'Product',
      key: 'product',
      render: (record: InventoryItem) => (
        <div className="flex items-center space-x-3">
          <Avatar
            size={50}
            src={record.image}
            icon={<InboxOutlined />}
            className="rounded-lg"
          />
          <div>
            <div className="font-medium">{record.productName}</div>
            <div className="text-sm text-gray-500">{record.sku}</div>
            <div className="text-xs text-gray-400">{record.category}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Current Stock',
      key: 'stock',
      render: (record: InventoryItem) => (
        <div className="text-center">
          <div className="text-lg font-semibold">
            {record.currentStock}
          </div>
          <Progress
            percent={(record.currentStock / record.maxStock) * 100}
            size="small"
            status={record.currentStock <= record.minStock ? 'exception' : 'normal'}
            showInfo={false}
          />
          <div className="text-xs text-gray-500 mt-1">
            Min: {record.minStock} | Max: {record.maxStock}
          </div>
        </div>
      ),
    },
    {
      title: 'Available',
      dataIndex: 'availableStock',
      key: 'availableStock',
      render: (stock: number, record: InventoryItem) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">{stock}</div>
          <div className="text-xs text-gray-500">
            Reserved: {record.reservedStock}
          </div>
        </div>
      ),
    },
    {
      title: 'Value',
      key: 'value',
      render: (record: InventoryItem) => (
        <div className="text-right">
          <div className="font-semibold">${record.totalValue.toFixed(2)}</div>
          <div className="text-sm text-gray-500">
            Cost: ${record.costPrice.toFixed(2)}
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier',
      key: 'supplier',
      render: (supplier: string) => (
        <div className="text-sm">{supplier}</div>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (location: string) => (
        <div className="text-sm text-gray-600">{location}</div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: InventoryItem) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'view',
                label: 'View Details',
                icon: <EyeOutlined />,
                onClick: () => showItemDetails(record),
              },
              {
                key: 'restock',
                label: 'Restock',
                icon: <PlusOutlined />,
                onClick: () => {
                  setSelectedItem(record);
                  setRestockModalVisible(true);
                },
              },
              {
                key: 'adjust',
                label: 'Adjust Stock',
                icon: <EditOutlined />,
                onClick: () => {
                  setSelectedItem(record);
                  setAdjustmentModalVisible(true);
                },
              },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<EyeOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const purchaseOrderColumns = [
    {
      title: 'PO Number',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => (
        <span className="font-mono text-blue-600 font-medium">{text}</span>
      ),
    },
    {
      title: 'Supplier',
      dataIndex: 'supplierName',
      key: 'supplierName',
    },
    {
      title: 'Items',
      key: 'items',
      render: (record: PurchaseOrder) => (
        <div>
          <div className="font-medium">{record.items.length} item(s)</div>
          <div className="text-sm text-gray-500">
            {record.items[0]?.productName}
            {record.items.length > 1 && ` +${record.items.length - 1} more`}
          </div>
        </div>
      ),
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => (
        <span className="font-semibold text-green-600">${amount.toFixed(2)}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getPOStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Expected Date',
      dataIndex: 'expectedDate',
      key: 'expectedDate',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : 'N/A',
    },
  ];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesLowStock = !lowStockOnly || item.currentStock <= item.minStock;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesLowStock;
  });

  // Calculate stats
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock).length;
  const outOfStockItems = inventory.filter(item => item.currentStock === 0).length;
  const totalValue = inventory.reduce((sum, item) => sum + item.totalValue, 0);

  // Stock level distribution
  const stockDistribution = [
    { name: 'In Stock', value: inventory.filter(i => i.status === 'in_stock').length, color: '#52c41a' },
    { name: 'Low Stock', value: lowStockItems, color: '#faad14' },
    { name: 'Out of Stock', value: outOfStockItems, color: '#ff4d4f' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <Space>
          <Button icon={<PlusOutlined />} onClick={() => setCreatePOVisible(true)}>
            Create Purchase Order
          </Button>
          <Button icon={<FileExcelOutlined />}>Export</Button>
          <Button icon={<SyncOutlined />}>Sync</Button>
        </Space>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Items"
              value={totalItems}
              valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<InboxOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Low Stock Alerts"
              value={lowStockItems}
              valueStyle={{ color: '#faad14', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<WarningOutlined />}
              suffix={
                <div className="text-sm text-orange-600 mt-1">
                  Need attention
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Out of Stock"
              value={outOfStockItems}
              valueStyle={{ color: '#f5222d', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<AlertOutlined />}
              suffix={
                <div className="text-sm text-red-600 mt-1">
                  Urgent restock
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Value"
              value={totalValue}
              precision={2}
              valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Alerts */}
      {lowStockItems > 0 && (
        <Alert
          message={`${lowStockItems} items are running low on stock`}
          description="Consider restocking these items to avoid stockouts"
          type="warning"
          showIcon
          action={
            <Button size="small" onClick={() => setLowStockOnly(true)}>
              View Low Stock Items
            </Button>
          }
          closable
        />
      )}

      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
        <TabPane tab="Inventory" key="inventory">
          {/* Filters */}
          <Card className="mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <Search
                placeholder="Search products, SKU, supplier..."
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
                <Option value="in_stock">In Stock</Option>
                <Option value="low_stock">Low Stock</Option>
                <Option value="out_of_stock">Out of Stock</Option>
                <Option value="discontinued">Discontinued</Option>
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
                type={lowStockOnly ? 'primary' : 'default'}
                icon={<WarningOutlined />}
                onClick={() => setLowStockOnly(!lowStockOnly)}
              >
                Low Stock Only
              </Button>
              <Button
                icon={<FilterOutlined />}
                onClick={() => {
                  setSearchText('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                  setLowStockOnly(false);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </Card>

          {/* Stock Distribution Chart */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} lg={8}>
              <Card title="Stock Distribution">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={stockDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stockDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={16}>
              <Card title="Stock Levels by Category">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[
                    { category: 'Clothing', in_stock: 25, low_stock: 5, out_of_stock: 2 },
                    { category: 'Accessories', in_stock: 15, low_stock: 3, out_of_stock: 1 },
                    { category: 'Footwear', in_stock: 12, low_stock: 2, out_of_stock: 0 },
                    { category: 'Bags', in_stock: 8, low_stock: 1, out_of_stock: 1 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="in_stock" stackId="a" fill="#52c41a" />
                    <Bar dataKey="low_stock" stackId="a" fill="#faad14" />
                    <Bar dataKey="out_of_stock" stackId="a" fill="#ff4d4f" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          {/* Inventory Table */}
          <Card>
            <Table
              columns={inventoryColumns}
              dataSource={filteredInventory}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 15,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
              scroll={{ x: 1200 }}
              className="overflow-x-auto"
            />
          </Card>
        </TabPane>

        <TabPane tab="Purchase Orders" key="purchase_orders">
          <Card>
            <Table
              columns={purchaseOrderColumns}
              dataSource={purchaseOrders}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Suppliers" key="suppliers">
          <Card>
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
              dataSource={suppliers}
              renderItem={supplier => (
                <List.Item>
                  <Card
                    size="small"
                    title={supplier.name}
                    extra={<Tag color={supplier.status === 'active' ? 'green' : 'red'}>{supplier.status}</Tag>}
                    actions={[
                      <Button type="text" icon={<EyeOutlined />} key="view" />,
                      <Button type="text" icon={<EditOutlined />} key="edit" />,
                    ]}
                  >
                    <div className="space-y-2">
                      <div className="text-sm">
                        <strong>Contact:</strong> {supplier.contactPerson}
                      </div>
                      <div className="text-sm">
                        <strong>Email:</strong> {supplier.email}
                      </div>
                      <div className="text-sm">
                        <strong>Lead Time:</strong> {supplier.leadTime} days
                      </div>
                      <div className="text-sm">
                        <strong>Rating:</strong> {supplier.rating}/5
                      </div>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Item Details Drawer */}
      <Drawer
        title={selectedItem ? `${selectedItem.productName} - ${selectedItem.sku}` : 'Item Details'}
        open={detailsVisible}
        onClose={() => setDetailsVisible(false)}
        width={600}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setRestockModalVisible(true);
              }}
            >
              Restock
            </Button>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setAdjustmentModalVisible(true);
              }}
            >
              Adjust
            </Button>
          </Space>
        }
      >
        {selectedItem && (
          <div className="space-y-6">
            {/* Item Overview */}
            <div className="text-center border-b pb-4">
              <Avatar
                size={100}
                src={selectedItem.image}
                icon={<InboxOutlined />}
                className="mb-4"
              />
              <h2 className="text-xl font-bold">{selectedItem.productName}</h2>
              <p className="text-gray-600">{selectedItem.sku}</p>
              <Tag color={getStatusColor(selectedItem.status)} className="mt-2">
                {selectedItem.status.replace('_', ' ').toUpperCase()}
              </Tag>
            </div>

            {/* Stock Information */}
            <div>
              <h3 className="text-lg font-medium mb-3">Stock Information</h3>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic title="Current Stock" value={selectedItem.currentStock} />
                </Col>
                <Col span={12}>
                  <Statistic title="Available" value={selectedItem.availableStock} />
                </Col>
                <Col span={12}>
                  <Statistic title="Reserved" value={selectedItem.reservedStock} />
                </Col>
                <Col span={12}>
                  <Statistic title="Total Value" value={selectedItem.totalValue} prefix="$" precision={2} />
                </Col>
              </Row>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Stock Level</span>
                  <span>{selectedItem.currentStock} / {selectedItem.maxStock}</span>
                </div>
                <Progress
                  percent={(selectedItem.currentStock / selectedItem.maxStock) * 100}
                  status={selectedItem.currentStock <= selectedItem.minStock ? 'exception' : 'normal'}
                />
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-lg font-medium mb-3">Pricing</h3>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic title="Cost Price" value={selectedItem.costPrice} prefix="$" precision={2} />
                </Col>
                <Col span={12}>
                  <Statistic title="Selling Price" value={selectedItem.sellingPrice} prefix="$" precision={2} />
                </Col>
              </Row>
            </div>

            {/* Recent Movements */}
            <div>
              <h3 className="text-lg font-medium mb-3">Recent Stock Movements</h3>
              <Timeline>
                {selectedItem.movements.slice(0, 5).map(movement => (
                  <Timeline.Item
                    key={movement.id}
                    color={movement.type === 'in' ? 'green' : movement.type === 'out' ? 'red' : 'blue'}
                  >
                    <div>
                      <div className="font-medium">
                        {movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : '±'}{Math.abs(movement.quantity)} units
                      </div>
                      <div className="text-sm text-gray-600">{movement.reason}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(movement.date).toLocaleString()}
                      </div>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
          </div>
        )}
      </Drawer>

      {/* Restock Modal */}
      <Modal
        title="Restock Inventory"
        open={restockModalVisible}
        onCancel={() => setRestockModalVisible(false)}
        onOk={() => form.submit()}
        okText="Restock"
      >
        <Form form={form} layout="vertical" onFinish={handleRestock}>
          <Form.Item
            name="quantity"
            label="Quantity to Add"
            rules={[{ required: true, message: 'Please enter quantity' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item name="reason" label="Reason">
            <Select placeholder="Select reason">
              <Option value="Purchase Order">Purchase Order</Option>
              <Option value="Stock Transfer">Stock Transfer</Option>
              <Option value="Return">Return</Option>
              <Option value="Manual Restock">Manual Restock</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="reference" label="Reference (Optional)">
            <Input placeholder="PO number, transfer reference, etc." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Stock Adjustment Modal */}
      <Modal
        title="Stock Adjustment"
        open={adjustmentModalVisible}
        onCancel={() => setAdjustmentModalVisible(false)}
        onOk={() => form.submit()}
        okText="Adjust Stock"
      >
        <Form form={form} layout="vertical" onFinish={handleAdjustment}>
          <Form.Item
            name="adjustment_type"
            label="Adjustment Type"
            rules={[{ required: true, message: 'Please select adjustment type' }]}
          >
            <Select placeholder="Select adjustment type">
              <Option value="increase">Increase Stock</Option>
              <Option value="decrease">Decrease Stock</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: 'Please enter quantity' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="reason"
            label="Reason"
            rules={[{ required: true, message: 'Please enter reason' }]}
          >
            <Select placeholder="Select reason">
              <Option value="Damaged">Damaged Items</Option>
              <Option value="Found">Found Items</Option>
              <Option value="Lost">Lost Items</Option>
              <Option value="Expired">Expired Items</Option>
              <Option value="Audit Adjustment">Audit Adjustment</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryList;
