import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  revenueGrowth: number;
  orderGrowth: number;
  userGrowth: number;
}

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

interface DashboardState {
  stats: DashboardStats;
  salesData: SalesData[];
  topProducts: Array<{ id: string; name: string; sales: number; revenue: number }>;
  recentOrders: Array<{ id: string; customer: string; amount: number; status: string; date: string }>;
  loading: boolean;
}

const initialState: DashboardState = {
  stats: {
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    revenueGrowth: 0,
    orderGrowth: 0,
    userGrowth: 0,
  },
  salesData: [],
  topProducts: [],
  recentOrders: [],
  loading: false,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setStats: (state, action: PayloadAction<DashboardStats>) => {
      state.stats = action.payload;
    },
    setSalesData: (state, action: PayloadAction<SalesData[]>) => {
      state.salesData = action.payload;
    },
    setTopProducts: (state, action: PayloadAction<typeof initialState.topProducts>) => {
      state.topProducts = action.payload;
    },
    setRecentOrders: (state, action: PayloadAction<typeof initialState.recentOrders>) => {
      state.recentOrders = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setStats, setSalesData, setTopProducts, setRecentOrders, setLoading } = dashboardSlice.actions;
export default dashboardSlice.reducer;