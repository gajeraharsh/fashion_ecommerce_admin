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
  Badge,
  Tooltip,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  message,
  Progress,
  Alert,
  Typography,
  Tabs,
  List,
  Avatar,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  WarningOutlined,
  ShoppingCartOutlined,
  TruckOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  StarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  BarChartOutlined,
  FileExcelOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title } = Typography;

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  maxStock: number;
  price: number;
  cost: number;
  location: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
  lastUpdated: string;
  supplier: string;
  reorderPoint: number;
  unitOfMeasure: string;
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplier: string;
  status: 'pending' | 'approved' | 'shipped' | 'received' | 'cancelled';
  orderDate: string;
  expectedDate: string;
  totalItems: number;
  totalValue: number;
  items: Array<{
    sku: string;
    name: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }>;
}

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive' | 'blocked';
  rating: number;
  totalOrders: number;
  leadTime: number;
  paymentTerms: string;
  categories: string[];
}

const InventoryList: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('inventory');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [form] = Form.useForm();

  // Mock data
  useEffect(() => {
    setInventory([
      {
        id: '1',
        sku: 'FAB-001',
        name: 'Premium Cotton T-Shirt',
        category: 'Clothing',
        stock: 150,
        minStock: 20,
        maxStock: 500,
        price: 29.99,
        cost: 12.50,
        location: 'Warehouse A',
        status: 'in_stock',
        lastUpdated: '2024-01-15',
        supplier: 'Fashion Suppliers Inc.',
        reorderPoint: 25,
        unitOfMeasure: 'pieces',
      },
      {
        id: '2',
        sku: 'ACC-002',
        name: 'Leather Belt',
        category: 'Accessories',
        stock: 5,
        minStock: 10,
        maxStock: 100,
        price: 49.99,
        cost: 20.00,
        location: 'Warehouse B',
        status: 'low_stock',
        lastUpdated: '2024-01-14',
        supplier: 'Leather Works Co.',
        reorderPoint: 15,
        unitOfMeasure: 'pieces',
      },
      {
        id: '3',
        sku: 'SHO-003',
        name: 'Running Sneakers',
        category: 'Footwear',
        stock: 0,
        minStock: 15,
        maxStock: 200,
        price: 89.99,
        cost: 45.00,
        location: 'Warehouse A',
        status: 'out_of_stock',
        lastUpdated: '2024-01-13',
        supplier: 'Footwear Direct',
        reorderPoint: 20,
        unitOfMeasure: 'pairs',
      },
    ]);

    setPurchaseOrders([
      {
        id: '1',
        orderNumber: 'PO-2024-001',
        supplier: 'Fashion Suppliers Inc.',
        status: 'pending',
        orderDate: '2024-01-15',
        expectedDate: '2024-01-25',
        totalItems: 200,
        totalValue: 2500.00,
        items: [
          { sku: 'FAB-001', name: 'Premium Cotton T-Shirt', quantity: 100, unitCost: 12.50, totalCost: 1250.00 },
          { sku: 'FAB-002', name: 'Cotton Polo Shirt', quantity: 100, unitCost: 12.50, totalCost: 1250.00 },
        ],
      },
    ]);

    setSuppliers([
      {
        id: '1',
        name: 'Fashion Suppliers Inc.',
        contactPerson: 'John Smith',
        email: 'john@fashionsuppliers.com',
        phone: '+1 234 567 8900',
        address: '123 Fashion Street, NY 10001',
        status: 'active',
        rating: 4.5,
        totalOrders: 45,
        leadTime: 7,
        paymentTerms: 'Net 30',
        categories: ['Clothing', 'Accessories'],
      },
      {
        id: '2',
        name: 'Leather Works Co.',
        contactPerson: 'Sarah Johnson',
        email: 'sarah@leatherworks.com',
        phone: '+1 234 567 8901',
        address: '456 Leather Ave, CA 90210',
        status: 'active',
        rating: 4.2,
        totalOrders: 28,
        leadTime: 10,
        paymentTerms: 'Net 15',
        categories: ['Accessories', 'Bags'],
      },
    ]);
  }, []);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const lowStockItems = inventory.filter(item => item.stock <= item.minStock);
  const outOfStockItems = inventory.filter(item => item.stock === 0);
  const totalValue = inventory.reduce((sum, item) => sum + (item.stock * item.cost), 0);

  const inventoryColumns = [
    {
      title: 'Product',
      key: 'product',
      render: (record: InventoryItem) => (
        <div>
          <div className="font-semibold">{record.name}</div>
          <div className="text-sm text-gray-500">SKU: {record.sku}</div>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag>{category}</Tag>,
    },
    {
      title: 'Stock',
      key: 'stock',
      render: (record: InventoryItem) => (
        <div>
          <Badge 
            status={record.status === 'out_of_stock' ? 'error' : record.status === 'low_stock' ? 'warning' : 'success'}
            text={`${record.stock} ${record.unitOfMeasure}`}
          />
          <div className="text-xs text-gray-500">Min: {record.minStock}</div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          in_stock: 'green',
          low_stock: 'orange',
          out_of_stock: 'red',
          discontinued: 'default',
        };
        return <Tag color={colors[status as keyof typeof colors]}>{status.replace('_', ' ').toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Value',
      key: 'value',
      render: (record: InventoryItem) => `$${(record.stock * record.cost).toFixed(2)}`,
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: InventoryItem) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button size="small" icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button size="small" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Reorder">
            <Button size="small" icon={<ShoppingCartOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const purchaseOrderColumns = [
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text: string) => <span className="font-mono">{text}</span>,
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier',
      key: 'supplier',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          pending: 'orange',
          approved: 'blue',
          shipped: 'purple',
          received: 'green',
          cancelled: 'red',
        };
        return <Tag color={colors[status as keyof typeof colors]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Items',
      dataIndex: 'totalItems',
      key: 'totalItems',
    },
    {
      title: 'Total Value',
      dataIndex: 'totalValue',
      key: 'totalValue',
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
    },
    {
      title: 'Expected',
      dataIndex: 'expectedDate',
      key: 'expectedDate',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="small">
          <Button size="small" icon={<EyeOutlined />} />
          <Button size="small" icon={<EditOutlined />} />
          <Button size="small" icon={<TruckOutlined />} />
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: 'inventory',
      label: 'Inventory',
      children: (
        <>
          <Row gutter={16} className="mb-6">
            <Col xs={24} sm={6}>
              <Card>
                <Statistic title="Total Items" value={inventory.length} />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic title="Low Stock Items" value={lowStockItems.length} valueStyle={{ color: '#fa8c16' }} />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic title="Out of Stock" value={outOfStockItems.length} valueStyle={{ color: '#ff4d4f' }} />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic title="Total Value" value={totalValue} prefix="$" precision={2} />
              </Card>
            </Col>
          </Row>

          {lowStockItems.length > 0 && (
            <Alert
              message="Low Stock Alert"
              description={`${lowStockItems.length} items are running low on stock and may need reordering.`}
              type="warning"
              icon={<WarningOutlined />}
              className="mb-6"
              action={
                <Button size="small" type="text">
                  View Details
                </Button>
              }
            />
          )}

          <Card className="mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <Search
                placeholder="Search products..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
              />
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 150 }}
              >
                <Option value="all">All Status</Option>
                <Option value="in_stock">In Stock</Option>
                <Option value="low_stock">Low Stock</Option>
                <Option value="out_of_stock">Out of Stock</Option>
              </Select>
              <Select
                value={categoryFilter}
                onChange={setCategoryFilter}
                style={{ width: 150 }}
              >
                <Option value="all">All Categories</Option>
                <Option value="Clothing">Clothing</Option>
                <Option value="Accessories">Accessories</Option>
                <Option value="Footwear">Footwear</Option>
              </Select>
              <Button type="primary" icon={<PlusOutlined />}>
                Add Item
              </Button>
              <Button icon={<FileExcelOutlined />}>Export</Button>
            </div>
          </Card>

          <Card>
            <Table
              columns={inventoryColumns}
              dataSource={filteredInventory}
              rowKey="id"
              loading={loading}
              pagination={{
                total: filteredInventory.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              }}
              scroll={{ x: 1200 }}
              className="overflow-x-auto"
            />
          </Card>
        </>
      ),
    },
    {
      key: 'purchase_orders',
      label: 'Purchase Orders',
      children: (
        <Card>
          <div className="mb-4">
            <Button type="primary" icon={<PlusOutlined />}>
              Create Purchase Order
            </Button>
          </div>
          <Table
            columns={purchaseOrderColumns}
            dataSource={purchaseOrders}
            rowKey="id"
            loading={loading}
          />
        </Card>
      ),
    },
    {
      key: 'suppliers',
      label: 'Suppliers',
      children: (
        <Card>
          <div className="mb-4">
            <Button type="primary" icon={<PlusOutlined />}>
              Add Supplier
            </Button>
          </div>
          <List
            dataSource={suppliers}
            renderItem={(supplier) => (
              <List.Item
                actions={[
                  <Button key="view" size="small" icon={<EyeOutlined />} />,
                  <Button key="edit" size="small" icon={<EditOutlined />} />,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={
                    <div className="flex items-center gap-2">
                      <span>{supplier.name}</span>
                      <Tag color={supplier.status === 'active' ? 'green' : 'red'}>
                        {supplier.status}
                      </Tag>
                    </div>
                  }
                  description={
                    <div>
                      <p>Contact: {supplier.contactPerson}</p>
                      <p>Email: {supplier.email}</p>
                      <p>Lead Time: {supplier.leadTime} days</p>
                      <p>Rating: {supplier.rating}/5</p>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2}>Inventory Management</Title>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card" items={tabItems} />
    </div>
  );
};

export default InventoryList;
