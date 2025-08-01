import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Card,
  Avatar,
  App,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  PrinterOutlined,
  EditOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setOrders, updateOrderStatus } from '../../store/slices/orderSlice';

const { Search } = Input;
const { Option } = Select;

const OrderList: React.FC = () => {
  const { message } = App.useApp();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading } = useSelector((state: RootState) => state.orders);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const downloadInvoice = (order: any) => {
    const invoiceData = `Invoice for Order ${order.id}\n\nCustomer: ${order.customerName}\nEmail: ${order.customerEmail}\nAmount: $${order.total}\nDate: ${order.date}\nStatus: ${order.status}\n\nThank you for your business!`;
    const blob = new Blob([invoiceData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${order.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    message.success('Invoice downloaded successfully');
  };

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockOrders = [
      {
        id: 'ORD-001',
        userId: 'user1',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        items: [
          {
            productId: 'p1',
            productName: 'Designer Evening Dress',
            variant: 'Black - M',
            quantity: 1,
            price: 299.99,
            image: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=100',
          },
        ],
        status: 'shipped' as const,
        paymentMethod: 'Credit Card',
        paymentStatus: 'paid' as const,
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
        },
        totalAmount: 299.99,
        createdAt: '2024-01-07T10:00:00Z',
        trackingNumber: 'TRK123456789',
      },
      {
        id: 'ORD-002',
        userId: 'user2',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        items: [
          {
            productId: 'p2',
            productName: 'Casual Cotton T-Shirt',
            variant: 'White - L',
            quantity: 2,
            price: 29.99,
            image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=100',
          },
          {
            productId: 'p3',
            productName: 'Leather Handbag',
            variant: 'Brown - One Size',
            quantity: 1,
            price: 199.99,
            image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=100',
          },
        ],
        status: 'packed' as const,
        paymentMethod: 'PayPal',
        paymentStatus: 'paid' as const,
        shippingAddress: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA',
        },
        totalAmount: 259.97,
        createdAt: '2024-01-06T15:30:00Z',
      },
    ];

    dispatch(setOrders(mockOrders));
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    const colors = {
      placed: 'blue',
      packed: 'orange',
      shipped: 'purple',
      delivered: 'green',
      returned: 'red',
    };
    return colors[status as keyof typeof colors] || 'default';
  };



  const handleStatusUpdate = (orderId: string, newStatus: any) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
    message.success('Order status updated successfully');
  };

  const showOrderDetails = (order: any) => {
    navigate(`/orders/${order.id}`);
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => (
        <span className="font-mono text-blue-600 font-medium">{text}</span>
      ),
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (record: any) => (
        <div className="flex items-center space-x-2">
          <Avatar icon={<UserOutlined />} />
          <div>
            <div className="font-medium">{record.customerName}</div>
            <div className="text-sm text-gray-500">{record.customerEmail}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Items',
      key: 'items',
      render: (record: any) => (
        <div className="flex -space-x-2">
          {record.items.slice(0, 3).map((item: any, index: number) => (
            <Avatar
              key={index}
              size={40}
              src={item.image}
              className="border-2 border-white rounded-lg"
            />
          ))}
          {record.items.length > 3 && (
            <Avatar size={40} className="bg-gray-100 text-gray-600 border-2 border-white">
              +{record.items.length - 3}
            </Avatar>
          )}
          <div className="ml-3 text-sm text-gray-600">
            {record.items.length} item{record.items.length > 1 ? 's' : ''}
          </div>
        </div>
      ),
    },
    {
      title: 'Amount',
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
        <Tag color={getStatusColor(status)} className="px-3 py-1">
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Payment',
      key: 'payment',
      render: (record: any) => (
        <div>
          <div className="text-sm">{record.paymentMethod}</div>
          <Tag
            color={record.paymentStatus === 'paid' ? 'green' : 'orange'}
            size="small"
          >
            {record.paymentStatus.toUpperCase()}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => showOrderDetails(record)}
          >
            View
          </Button>
          <Button
            type="text"
            icon={<PrinterOutlined />}
            onClick={() => downloadInvoice(record)}
          >
            Invoice
          </Button>
        </Space>
      ),
    },
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchText.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
          <div className="text-gray-600">Total Orders</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {orders.filter(o => o.status === 'placed').length}
          </div>
          <div className="text-gray-600">New Orders</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {orders.filter(o => o.status === 'shipped').length}
          </div>
          <div className="text-gray-600">Shipped</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {orders.filter(o => o.status === 'delivered').length}
          </div>
          <div className="text-gray-600">Delivered</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {orders.filter(o => o.status === 'returned').length}
          </div>
          <div className="text-gray-600">Returns</div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4 items-center">
          <Search
            placeholder="Search orders, customer..."
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
            <Option value="placed">Placed</Option>
            <Option value="packed">Packed</Option>
            <Option value="shipped">Shipped</Option>
            <Option value="delivered">Delivered</Option>
            <Option value="returned">Returned</Option>
          </Select>
        </div>
      </Card>

      {/* Orders Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} orders`,
          }}
          className="overflow-x-auto"
        />
      </Card>


    </div>
  );
};

export default OrderList;
