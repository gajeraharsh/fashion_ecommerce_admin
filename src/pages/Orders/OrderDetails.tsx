import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Space,
  Tag,
  Steps,
  Descriptions,
  Divider,
  Avatar,
  Select,
  App,
  Typography,
} from 'antd';
import {
  ArrowLeftOutlined,
  PrinterOutlined,
  EditOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateOrderStatus } from '../../store/slices/orderSlice';

const { Option } = Select;
const { Step } = Steps;

const OrderDetails: React.FC = () => {
  const [order, setOrder] = useState<any>(null);
  const { message } = App.useApp();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { orders } = useSelector((state: RootState) => state.orders);

  // Mock orders data for demo
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
          productName: 'Denim Jeans',
          variant: 'Blue - 32',
          quantity: 1,
          price: 79.99,
          image: 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=100',
        },
      ],
      status: 'delivered' as const,
      paymentMethod: 'PayPal',
      paymentStatus: 'paid' as const,
      shippingAddress: {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA',
      },
      totalAmount: 139.97,
      createdAt: '2024-01-05T14:30:00Z',
      trackingNumber: 'TRK987654321',
    },
  ];

  useEffect(() => {
    // In a real app, fetch order by ID from API
    const foundOrder = mockOrders.find(o => o.id === id);
    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      message.error('Order not found');
      navigate('/orders');
    }
  }, [id, navigate, message]);

  const getStatusStep = (status: string): number => {
    const statusMap: { [key: string]: number } = {
      placed: 0,
      packed: 1,
      shipped: 2,
      delivered: 3,
      returned: 3,
    };
    return statusMap[status] || 0;
  };

  const getStatusColor = (status: string): string => {
    const colorMap: { [key: string]: string } = {
      placed: 'blue',
      packed: 'orange',
      shipped: 'purple',
      delivered: 'green',
      returned: 'red',
      cancelled: 'default',
    };
    return colorMap[status] || 'default';
  };

  const handleStatusUpdate = (newStatus: string) => {
    if (order) {
      dispatch(updateOrderStatus({ orderId: order.id, status: newStatus }));
      setOrder({ ...order, status: newStatus });
      message.success('Order status updated successfully');
    }
  };

  const downloadInvoice = () => {
    if (!order) return;
    
    const invoiceData = `Invoice for Order ${order.id}\n\nCustomer: ${order.customerName}\nEmail: ${order.customerEmail}\nAmount: $${order.totalAmount}\nDate: ${order.createdAt}\nStatus: ${order.status}\n\nThank you for your business!`;
    const blob = new Blob([invoiceData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${order.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    message.success('Invoice downloaded successfully');
  };

  const handleBack = () => {
    navigate('/orders');
  };

  if (!order) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center">Order not found</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Custom Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Space>
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={handleBack}
                type="text"
              />
              <div>
                <Typography.Title level={3} className="!mb-0">
                  Order Details - {order.id}
                </Typography.Title>
                <Typography.Text type="secondary">
                  View and manage order information
                </Typography.Text>
              </div>
            </Space>
          </div>
          <Space>
            <Button icon={<PrinterOutlined />} onClick={downloadInvoice}>
              Download Invoice
            </Button>
            <Select
              style={{ width: 150 }}
              value={order.status}
              onChange={handleStatusUpdate}
            >
              <Option value="placed">Placed</Option>
              <Option value="packed">Packed</Option>
              <Option value="shipped">Shipped</Option>
              <Option value="delivered">Delivered</Option>
              <Option value="returned">Returned</Option>
            </Select>
          </Space>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Status */}
        <div className="lg:col-span-3">
          <Card title="Order Status" className="mb-6">
            <Steps current={getStatusStep(order.status)} size="small">
              <Step title="Placed" description="Order received" />
              <Step title="Packed" description="Items packed" />
              <Step title="Shipped" description="Out for delivery" />
              <Step title="Delivered" description="Order completed" />
            </Steps>
            <div className="mt-4">
              <Tag color={getStatusColor(order.status)} className="text-sm px-3 py-1">
                {order.status.toUpperCase()}
              </Tag>
            </div>
          </Card>
        </div>

        {/* Customer Information */}
        <Card title="Customer Information">
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Name">{order.customerName}</Descriptions.Item>
            <Descriptions.Item label="Email">{order.customerEmail}</Descriptions.Item>
            <Descriptions.Item label="Order Date">
              {new Date(order.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Payment Method">{order.paymentMethod}</Descriptions.Item>
            <Descriptions.Item label="Payment Status">
              <Tag color={order.paymentStatus === 'paid' ? 'green' : 'orange'}>
                {order.paymentStatus.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            {order.trackingNumber && (
              <Descriptions.Item label="Tracking Number">{order.trackingNumber}</Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {/* Shipping Address */}
        <Card title="Shipping Address">
          <div className="space-y-2">
            <div>{order.shippingAddress.street}</div>
            <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</div>
            <div>{order.shippingAddress.country}</div>
          </div>
        </Card>

        {/* Order Summary */}
        <Card title="Order Summary">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Items ({order.items.length}):</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>$0.00</span>
            </div>
            <Divider className="my-2" />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Order Items */}
      <Card title="Order Items" className="mt-6">
        <div className="space-y-4">
          {order.items.map((item: any, index: number) => (
            <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
              <Avatar size={80} src={item.image} className="rounded-lg" />
              <div className="flex-1">
                <div className="font-medium text-lg">{item.productName}</div>
                <div className="text-gray-500">{item.variant}</div>
                <div className="text-sm mt-1">Quantity: {item.quantity}</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-lg">${(item.price * item.quantity).toFixed(2)}</div>
                <div className="text-sm text-gray-500">${item.price.toFixed(2)} each</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default OrderDetails;
