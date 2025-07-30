import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  totalCount: number;
  totalRevenue: number;
  totalFees: number;
  analytics: {
    dailyRevenue: Array<{ date: string; revenue: number; transactions: number; fees: number }>;
    paymentMethods: Array<{ name: string; value: number; color: string }>;
    statusDistribution: Array<{ status: string; count: number; percentage: number }>;
  };
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  totalCount: 0,
  totalRevenue: 0,
  totalFees: 0,
  analytics: {
    dailyRevenue: [],
    paymentMethods: [],
    statusDistribution: [],
  },
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
      state.totalCount = action.payload.length;
      
      // Calculate totals
      state.totalRevenue = action.payload
        .filter(t => t.status === 'completed' && t.type === 'payment')
        .reduce((sum, t) => sum + t.amount, 0);
      
      state.totalFees = action.payload
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.fees, 0);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
      state.totalCount += 1;
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },
    updateTransactionStatus: (state, action: PayloadAction<{ transactionId: string; status: Transaction['status'] }>) => {
      const transaction = state.transactions.find(t => t.id === action.payload.transactionId);
      if (transaction) {
        transaction.status = action.payload.status;
      }
    },
    processRefund: (state, action: PayloadAction<{ transactionId: string; refundAmount: number; reason: string }>) => {
      const transaction = state.transactions.find(t => t.id === action.payload.transactionId);
      if (transaction) {
        transaction.status = 'refunded';
        if (!transaction.refunds) {
          transaction.refunds = [];
        }
        transaction.refunds.push({
          id: `ref_${Date.now()}`,
          amount: action.payload.refundAmount,
          reason: action.payload.reason,
          processedAt: new Date().toISOString(),
          status: 'completed',
        });
      }
    },
    setAnalytics: (state, action: PayloadAction<TransactionState['analytics']>) => {
      state.analytics = action.payload;
    },
  },
});

export const {
  setTransactions,
  setLoading,
  addTransaction,
  updateTransaction,
  updateTransactionStatus,
  processRefund,
  setAnalytics,
} = transactionSlice.actions;

export default transactionSlice.reducer;
