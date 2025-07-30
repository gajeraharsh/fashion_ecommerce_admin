import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderItem {
  productId: string;
  productName: string;
  variant: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  status: 'placed' | 'packed' | 'shipped' | 'delivered' | 'returned';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  totalAmount: number;
  createdAt: string;
  trackingNumber?: string;
}

interface OrderState {
  orders: Order[];
  loading: boolean;
  totalCount: number;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  totalCount: 0,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: Order['status'] }>) => {
      const order = state.orders.find(o => o.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
      }
    },
  },
});

export const { setOrders, setLoading, updateOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;