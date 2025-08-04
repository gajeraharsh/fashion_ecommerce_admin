import api from './api';

export interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'PROCESSING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED' | 'PAYMENT_FAILED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  totalAmount: number;
  subtotalAmount: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  trackingNumber?: string;
  shippingCarrier?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  address?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  items?: OrderItem[];
  payments?: Payment[];
  refunds?: Refund[];
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  totalPrice: number;
  product?: {
    id: string;
    name: string;
    slug: string;
    sku?: string;
    images?: {
      url: string;
      alt?: string;
    }[];
  };
}

export interface Payment {
  id: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  method: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAYPAL' | 'STRIPE' | 'RAZORPAY' | 'COD';
  transactionId?: string;
  createdAt: string;
}

export interface Refund {
  id: string;
  amount: number;
  reason?: string;
  status: 'PENDING' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
  createdAt: string;
}

export interface UpdateOrderStatusData {
  status: 'PENDING' | 'PROCESSING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED' | 'PAYMENT_FAILED';
}

export interface UpdateOrderData {
  status?: 'PENDING' | 'PROCESSING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED' | 'PAYMENT_FAILED';
  trackingNumber?: string;
  shippingCarrier?: string;
  notes?: string;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface OrderStats {
  totalOrders: number;
  ordersToday: number;
  ordersThisMonth: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  revenueThisMonth: number;
  averageOrderValue: number;
  recentOrders: Order[];
}

class OrderService {
  // Get all orders with pagination and filters
  async getAllOrders(filters: OrderFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/admin/orders?${params.toString()}`);
    return response.data;
  }

  // Get order by ID
  async getOrderById(id: string) {
    const response = await api.get(`/admin/orders/${id}`);
    return response.data;
  }

  // Update order status
  async updateOrderStatus(id: string, statusData: UpdateOrderStatusData) {
    const response = await api.patch(`/admin/orders/${id}/status`, statusData);
    return response.data;
  }

  // Update order details
  async updateOrder(id: string, orderData: UpdateOrderData) {
    const response = await api.put(`/admin/orders/${id}`, orderData);
    return response.data;
  }

  // Cancel order
  async cancelOrder(id: string, reason?: string) {
    const response = await api.patch(`/admin/orders/${id}/cancel`, { reason });
    return response.data;
  }

  // Get order statistics
  async getOrderStats(): Promise<{ success: boolean; data: OrderStats }> {
    const response = await api.get('/admin/orders/stats');
    return response.data;
  }

  // Bulk update order status
  async bulkUpdateOrderStatus(orderIds: string[], status: string) {
    const response = await api.patch('/admin/orders/bulk-status', {
      orderIds,
      status,
    });
    return response.data;
  }

  // Get order status options
  getOrderStatusOptions() {
    return [
      { value: 'PENDING', label: 'Pending', color: 'orange' },
      { value: 'PROCESSING', label: 'Processing', color: 'blue' },
      { value: 'CONFIRMED', label: 'Confirmed', color: 'cyan' },
      { value: 'SHIPPED', label: 'Shipped', color: 'purple' },
      { value: 'DELIVERED', label: 'Delivered', color: 'green' },
      { value: 'CANCELLED', label: 'Cancelled', color: 'red' },
      { value: 'REFUNDED', label: 'Refunded', color: 'magenta' },
      { value: 'PAYMENT_FAILED', label: 'Payment Failed', color: 'red' },
    ];
  }

  // Get payment status options
  getPaymentStatusOptions() {
    return [
      { value: 'PENDING', label: 'Pending', color: 'orange' },
      { value: 'PAID', label: 'Paid', color: 'green' },
      { value: 'FAILED', label: 'Failed', color: 'red' },
      { value: 'REFUNDED', label: 'Refunded', color: 'magenta' },
    ];
  }
}

export const orderService = new OrderService();
export default orderService;
