import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  InputNumber,
  Select,
  Card,
  Row,
  Col,
  Statistic,
  DatePicker,
  Modal,
  Descriptions,
  Progress,
  Timeline,
  Badge,
  Tooltip,
  Dropdown,
  message,
  Alert,
  List,
  Avatar,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  DownloadOutlined,
  FilterOutlined,
  DollarOutlined,
  CreditCardOutlined,
  BankOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PayCircleOutlined,
  UndoOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setTransactions, updateTransactionStatus } from '../../store/slices/transactionSlice';
import dayjs, { Dayjs } from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface Transaction {
  id: string;
  orderId: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer' | 'stripe' | 'cash';
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'disputed' | 'cancelled';
  type: 'payment' | 'refund' | 'chargeback' | 'fee';
  gateway: string;
  gatewayTransactionId: string;
  fees: number;
  netAmount: number;
  processedAt: string;
  createdAt: string;
  description?: string;
  metadata?: {
    ip_address?: string;
    user_agent?: string;
    risk_score?: number;
    country?: string;
  };
  refunds?: Array<{
    id: string;
    amount: number;
    reason: string;
    processedAt: string;
    status: 'pending' | 'completed' | 'failed';
  }>;
}

const TransactionList: React.FC = () => {
  const dispatch = useDispatch();
  const { transactions, loading } = useSelector((state: RootState) => state.transactions);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [refundModalVisible, setRefundModalVisible] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundReason, setRefundReason] = useState('');

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockTransactions: Transaction[] = [
      {
        id: 'txn_001',
        orderId: 'ORD-001',
        userId: 'user1',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        amount: 299.99,
        currency: 'USD',
        paymentMethod: 'credit_card',
        status: 'completed',
        type: 'payment',
        gateway: 'Stripe',
        gatewayTransactionId: 'pi_1234567890',
        fees: 8.70,
        netAmount: 291.29,
        processedAt: '2024-01-07T10:30:00Z',
        createdAt: '2024-01-07T10:28:00Z',
        description: 'Payment for Order #ORD-001',
        metadata: {
          ip_address: '192.168.1.1',
          user_agent: 'Mozilla/5.0...',
          risk_score: 15,
          country: 'US',
        },
      },
      {
        id: 'txn_002',
        orderId: 'ORD-002',
        userId: 'user2',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        amount: 450.00,
        currency: 'USD',
        paymentMethod: 'paypal',
        status: 'completed',
        type: 'payment',
        gateway: 'PayPal',
        gatewayTransactionId: 'PAY-987654321',
        fees: 13.05,
        netAmount: 436.95,
        processedAt: '2024-01-06T15:45:00Z',
        createdAt: '2024-01-06T15:43:00Z',
        description: 'Payment for Order #ORD-002',
        metadata: {
          ip_address: '192.168.1.2',
          user_agent: 'Mozilla/5.0...',
          risk_score: 8,
          country: 'US',
        },
      },
      {
        id: 'txn_003',
        orderId: 'ORD-003',
        userId: 'user1',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        amount: -49.99,
        currency: 'USD',
        paymentMethod: 'credit_card',
        status: 'completed',
        type: 'refund',
        gateway: 'Stripe',
        gatewayTransactionId: 're_1234567890',
        fees: -1.45,
        netAmount: -48.54,
        processedAt: '2024-01-05T12:00:00Z',
        createdAt: '2024-01-05T11:58:00Z',
        description: 'Refund for defective item',
      },
      {
        id: 'txn_004',
        orderId: 'ORD-004',
        userId: 'user3',
        customerName: 'Mike Johnson',
        customerEmail: 'mike@example.com',
        amount: 89.99,
        currency: 'USD',
        paymentMethod: 'credit_card',
        status: 'failed',
        type: 'payment',
        gateway: 'Stripe',
        gatewayTransactionId: 'pi_failed123',
        fees: 0,
        netAmount: 0,
        processedAt: '2024-01-04T09:15:00Z',
        createdAt: '2024-01-04T09:12:00Z',
        description: 'Failed payment - insufficient funds',
        metadata: {
          ip_address: '192.168.1.3',
          user_agent: 'Mozilla/5.0...',
          risk_score: 45,
          country: 'US',
        },
      },
    ];

    dispatch(setTransactions(mockTransactions));
  }, [dispatch]);

  // Analytics data
  const analyticsData = [
    { date: '2024-01-01', revenue: 2400, transactions: 45, fees: 69.60 },
    { date: '2024-01-02', revenue: 1398, transactions: 28, fees: 40.54 },
    { date: '2024-01-03', revenue: 9800, transactions: 67, fees: 284.20 },
    { date: '2024-01-04', revenue: 3908, transactions: 52, fees: 113.33 },
    { date: '2024-01-05', revenue: 4800, transactions: 61, fees: 139.20 },
    { date: '2024-01-06', revenue: 3800, transactions: 39, fees: 110.20 },
    { date: '2024-01-07', revenue: 4300, transactions: 48, fees: 124.70 },
  ];

  const paymentMethodData = [
    { name: 'Credit Card', value: 65, color: '#8884d8' },
    { name: 'PayPal', value: 25, color: '#82ca9d' },
    { name: 'Bank Transfer', value: 8, color: '#ffc658' },
    { name: 'Other', value: 2, color: '#ff7c7c' },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'orange',
      completed: 'green',
      failed: 'red',
      refunded: 'blue',
      disputed: 'purple',
      cancelled: 'gray',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <SyncOutlined spin />,
      completed: <CheckCircleOutlined />,
      failed: <CloseCircleOutlined />,
      refunded: <UndoOutlined />,
      disputed: <ExclamationCircleOutlined />,
      cancelled: <CloseCircleOutlined />,
    };
    return icons[status as keyof typeof icons] || <ExclamationCircleOutlined />;
  };

  const getPaymentMethodIcon = (method: string) => {
    const icons = {
      credit_card: <CreditCardOutlined />,
      paypal: <PayCircleOutlined />,
      bank_transfer: <BankOutlined />,
      stripe: <CreditCardOutlined />,
      cash: <DollarOutlined />,
    };
    return icons[method as keyof typeof icons] || <CreditCardOutlined />;
  };

  const handleRefund = async () => {
    if (!selectedTransaction || refundAmount <= 0) return;

    try {
      // Simulate refund process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      dispatch(updateTransactionStatus({
        transactionId: selectedTransaction.id,
        status: 'refunded',
      }));

      message.success('Refund processed successfully');
      setRefundModalVisible(false);
      setRefundAmount(0);
      setRefundReason('');
    } catch (error) {
      message.error('Failed to process refund');
    }
  };

  const showTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailsVisible(true);
  };

  const columns = [
    {
      title: 'Transaction ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => (
        <span className="font-mono text-blue-600 font-medium">{text}</span>
      ),
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (record: Transaction) => (
        <div>
          <div className="font-medium">{record.customerName}</div>
          <div className="text-sm text-gray-500">{record.customerEmail}</div>
        </div>
      ),
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (record: Transaction) => (
        <div className="text-right">
          <div className={`font-semibold ${record.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {record.amount >= 0 ? '+' : ''}${Math.abs(record.amount).toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">
            Net: ${record.netAmount.toFixed(2)}
          </div>
        </div>
      ),
    },
    {
      title: 'Payment Method',
      key: 'paymentMethod',
      render: (record: Transaction) => (
        <div className="flex items-center space-x-2">
          {getPaymentMethodIcon(record.paymentMethod)}
          <span className="capitalize">{record.paymentMethod.replace('_', ' ')}</span>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'payment' ? 'green' : type === 'refund' ? 'blue' : 'orange'}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Gateway',
      dataIndex: 'gateway',
      key: 'gateway',
    },
    {
      title: 'Date',
      dataIndex: 'processedAt',
      key: 'processedAt',
      render: (date: string) => (
        <div className="text-sm">
          <div>{new Date(date).toLocaleDateString()}</div>
          <div className="text-gray-500">{new Date(date).toLocaleTimeString()}</div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Transaction) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'view',
                label: 'View Details',
                icon: <EyeOutlined />,
                onClick: () => showTransactionDetails(record),
              },
              {
                key: 'refund',
                label: 'Process Refund',
                icon: <UndoOutlined />,
                disabled: record.status !== 'completed' || record.type !== 'payment',
                onClick: () => {
                  setSelectedTransaction(record);
                  setRefundAmount(record.amount);
                  setRefundModalVisible(true);
                },
              },
              {
                key: 'download',
                label: 'Download Receipt',
                icon: <DownloadOutlined />,
                onClick: () => message.info('Downloading receipt...'),
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

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.id.toLowerCase().includes(searchText.toLowerCase()) ||
                         transaction.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
                         transaction.customerEmail.toLowerCase().includes(searchText.toLowerCase()) ||
                         transaction.orderId.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesPaymentMethod = paymentMethodFilter === 'all' || transaction.paymentMethod === paymentMethodFilter;
    
    let matchesDate = true;
    if (dateRange && dateRange[0] && dateRange[1]) {
      const transactionDate = dayjs(transaction.processedAt);
      matchesDate = transactionDate.isAfter(dateRange[0].startOf('day')) &&
                   transactionDate.isBefore(dateRange[1].endOf('day'));
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesPaymentMethod && matchesDate;
  });

  // Calculate stats
  const totalTransactions = transactions.length;
  const completedTransactions = transactions.filter(t => t.status === 'completed').length;
  const totalRevenue = transactions
    .filter(t => t.status === 'completed' && t.type === 'payment')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalFees = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.fees, 0);
  const refundedAmount = Math.abs(transactions
    .filter(t => t.status === 'completed' && t.type === 'refund')
    .reduce((sum, t) => sum + t.amount, 0));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Transaction Management</h1>
        <Space>
          <Button icon={<FileExcelOutlined />}>Export Excel</Button>
          <Button icon={<FilePdfOutlined />}>Export PDF</Button>
        </Space>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              precision={2}
              valueStyle={{ color: '#3f8600', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<DollarOutlined />}
              suffix={
                <div className="text-sm text-green-600 mt-1">
                  <ArrowUpOutlined /> 12.5%
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Transactions"
              value={totalTransactions}
              valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<CreditCardOutlined />}
              suffix={
                <div className="text-sm text-blue-600 mt-1">
                  {completedTransactions} completed
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Fees"
              value={totalFees}
              precision={2}
              valueStyle={{ color: '#fa8c16', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<BankOutlined />}
              suffix={
                <div className="text-sm text-orange-600 mt-1">
                  {((totalFees / totalRevenue) * 100).toFixed(2)}% of revenue
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title="Refunded"
              value={refundedAmount}
              precision={2}
              valueStyle={{ color: '#f5222d', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<UndoOutlined />}
              suffix={
                <div className="text-sm text-red-600 mt-1">
                  {((refundedAmount / totalRevenue) * 100).toFixed(2)}% of revenue
                </div>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Revenue Analytics" className="h-full">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                  name="Revenue ($)"
                />
                <Area
                  type="monotone"
                  dataKey="fees"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                  name="Fees ($)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Payment Methods" className="h-full">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4 items-center">
          <Search
            placeholder="Search transactions, customer, order..."
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
            <Option value="pending">Pending</Option>
            <Option value="completed">Completed</Option>
            <Option value="failed">Failed</Option>
            <Option value="refunded">Refunded</Option>
            <Option value="disputed">Disputed</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
          <Select
            style={{ width: 150 }}
            value={typeFilter}
            onChange={setTypeFilter}
            placeholder="Filter by type"
          >
            <Option value="all">All Types</Option>
            <Option value="payment">Payment</Option>
            <Option value="refund">Refund</Option>
            <Option value="chargeback">Chargeback</Option>
            <Option value="fee">Fee</Option>
          </Select>
          <Select
            style={{ width: 150 }}
            value={paymentMethodFilter}
            onChange={setPaymentMethodFilter}
            placeholder="Payment method"
          >
            <Option value="all">All Methods</Option>
            <Option value="credit_card">Credit Card</Option>
            <Option value="paypal">PayPal</Option>
            <Option value="bank_transfer">Bank Transfer</Option>
            <Option value="stripe">Stripe</Option>
            <Option value="cash">Cash</Option>
          </Select>
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            placeholder={['Start Date', 'End Date']}
          />
          <Button
            icon={<FilterOutlined />}
            onClick={() => {
              setSearchText('');
              setStatusFilter('all');
              setTypeFilter('all');
              setPaymentMethodFilter('all');
              setDateRange(null);
            }}
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredTransactions}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} transactions`,
          }}
          scroll={{ x: 1200 }}
          className="overflow-x-auto"
        />
      </Card>

      {/* Transaction Details Modal */}
      <Modal
        title={`Transaction Details - ${selectedTransaction?.id}`}
        open={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setDetailsVisible(false)}>
            Close
          </Button>,
          <Button key="receipt" type="default" icon={<DownloadOutlined />}>
            Download Receipt
          </Button>,
          selectedTransaction?.status === 'completed' && selectedTransaction?.type === 'payment' && (
            <Button
              key="refund"
              type="primary"
              danger
              icon={<UndoOutlined />}
              onClick={() => {
                setRefundAmount(selectedTransaction.amount);
                setRefundModalVisible(true);
              }}
            >
              Process Refund
            </Button>
          ),
        ]}
      >
        {selectedTransaction && (
          <div className="space-y-6">
            {/* Transaction Status */}
            <div className="text-center border-b pb-4">
              <div className="text-3xl mb-2">
                {getStatusIcon(selectedTransaction.status)}
              </div>
              <Tag
                color={getStatusColor(selectedTransaction.status)}
                className="text-lg px-4 py-2"
              >
                {selectedTransaction.status.toUpperCase()}
              </Tag>
            </div>

            {/* Transaction Information */}
            <Descriptions title="Transaction Information" column={2}>
              <Descriptions.Item label="Transaction ID">{selectedTransaction.id}</Descriptions.Item>
              <Descriptions.Item label="Order ID">{selectedTransaction.orderId}</Descriptions.Item>
              <Descriptions.Item label="Type">
                <Tag color={selectedTransaction.type === 'payment' ? 'green' : 'blue'}>
                  {selectedTransaction.type.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Gateway">{selectedTransaction.gateway}</Descriptions.Item>
              <Descriptions.Item label="Gateway Transaction ID">
                {selectedTransaction.gatewayTransactionId}
              </Descriptions.Item>
              <Descriptions.Item label="Currency">{selectedTransaction.currency}</Descriptions.Item>
            </Descriptions>

            {/* Financial Details */}
            <Descriptions title="Financial Details" column={2}>
              <Descriptions.Item label="Amount">
                <span className={selectedTransaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                  ${Math.abs(selectedTransaction.amount).toFixed(2)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Fees">
                ${selectedTransaction.fees.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="Net Amount">
                <span className="font-semibold">
                  ${selectedTransaction.netAmount.toFixed(2)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Method">
                <div className="flex items-center space-x-2">
                  {getPaymentMethodIcon(selectedTransaction.paymentMethod)}
                  <span className="capitalize">
                    {selectedTransaction.paymentMethod.replace('_', ' ')}
                  </span>
                </div>
              </Descriptions.Item>
            </Descriptions>

            {/* Customer Information */}
            <Descriptions title="Customer Information" column={2}>
              <Descriptions.Item label="Name">{selectedTransaction.customerName}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedTransaction.customerEmail}</Descriptions.Item>
            </Descriptions>

            {/* Timeline */}
            <div>
              <h3 className="text-lg font-medium mb-3">Transaction Timeline</h3>
              <Timeline>
                <Timeline.Item
                  dot={<CalendarOutlined className="text-blue-500" />}
                  color="blue"
                >
                  <div>
                    <div className="font-medium">Transaction Created</div>
                    <div className="text-sm text-gray-500">
                      {new Date(selectedTransaction.createdAt).toLocaleString()}
                    </div>
                  </div>
                </Timeline.Item>
                <Timeline.Item
                  dot={getStatusIcon(selectedTransaction.status)}
                  color={getStatusColor(selectedTransaction.status)}
                >
                  <div>
                    <div className="font-medium">Transaction {selectedTransaction.status}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(selectedTransaction.processedAt).toLocaleString()}
                    </div>
                  </div>
                </Timeline.Item>
              </Timeline>
            </div>

            {/* Metadata */}
            {selectedTransaction.metadata && (
              <Descriptions title="Additional Information" column={2}>
                <Descriptions.Item label="IP Address">
                  {selectedTransaction.metadata.ip_address}
                </Descriptions.Item>
                <Descriptions.Item label="Country">
                  {selectedTransaction.metadata.country}
                </Descriptions.Item>
                <Descriptions.Item label="Risk Score">
                  <Progress
                    percent={selectedTransaction.metadata.risk_score}
                    size="small"
                    status={selectedTransaction.metadata.risk_score! > 50 ? 'exception' : 'normal'}
                    format={() => `${selectedTransaction.metadata?.risk_score}%`}
                  />
                </Descriptions.Item>
              </Descriptions>
            )}

            {selectedTransaction.description && (
              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <Alert message={selectedTransaction.description} type="info" />
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Refund Modal */}
      <Modal
        title="Process Refund"
        open={refundModalVisible}
        onCancel={() => setRefundModalVisible(false)}
        onOk={handleRefund}
        okText="Process Refund"
        okButtonProps={{ danger: true }}
      >
        <div className="space-y-4">
          <Alert
            message="Warning"
            description="This action will process a refund for the selected transaction. This cannot be undone."
            type="warning"
            showIcon
          />
          
          <div>
            <label className="block text-sm font-medium mb-2">Refund Amount</label>
            <InputNumber
              value={refundAmount}
              onChange={(value) => setRefundAmount(value || 0)}
              min={0}
              max={selectedTransaction?.amount || 0}
              precision={2}
              prefix="$"
              style={{ width: '100%' }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Reason for Refund</label>
            <Select
              value={refundReason}
              onChange={setRefundReason}
              style={{ width: '100%' }}
              placeholder="Select reason for refund"
            >
              <Option value="customer_request">Customer Request</Option>
              <Option value="defective_product">Defective Product</Option>
              <Option value="wrong_item">Wrong Item Sent</Option>
              <Option value="damaged_shipping">Damaged in Shipping</Option>
              <Option value="duplicate_charge">Duplicate Charge</Option>
              <Option value="other">Other</Option>
            </Select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TransactionList;
