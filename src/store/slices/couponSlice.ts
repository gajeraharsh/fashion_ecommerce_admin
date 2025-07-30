import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'free_shipping' | 'buy_x_get_y';
  value: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
  excludedProducts?: string[];
  excludedCategories?: string[];
  usageLimit?: number;
  usageLimitPerCustomer?: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'expired' | 'draft';
  customerEligibility: 'all' | 'new_customers' | 'returning_customers' | 'vip_customers';
  stackable: boolean;
  oneTimeUse: boolean;
  autoApply: boolean;
  createdAt: string;
  updatedAt: string;
  analytics: {
    totalUsage: number;
    totalRevenue: number;
    totalDiscount: number;
    averageOrderValue: number;
    conversionRate: number;
  };
  rules?: {
    buyXGetY?: {
      buyQuantity: number;
      getQuantity: number;
      getProductId?: string;
    };
    minimumQuantity?: number;
    firstTimeCustomers?: boolean;
  };
}

interface CouponUsage {
  id: string;
  couponId: string;
  couponCode: string;
  orderId: string;
  userId: string;
  customerName: string;
  discountAmount: number;
  orderAmount: number;
  usedAt: string;
}

interface CouponState {
  coupons: Coupon[];
  couponUsage: CouponUsage[];
  loading: boolean;
  totalCount: number;
  activeCount: number;
  totalDiscountGiven: number;
  totalRevenueGenerated: number;
  analytics: {
    monthlyUsage: Array<{ month: string; usage: number; revenue: number }>;
    typeDistribution: Array<{ type: string; count: number; percentage: number }>;
    topPerformingCoupons: Array<{ id: string; code: string; usage: number; revenue: number }>;
  };
}

const initialState: CouponState = {
  coupons: [],
  couponUsage: [],
  loading: false,
  totalCount: 0,
  activeCount: 0,
  totalDiscountGiven: 0,
  totalRevenueGenerated: 0,
  analytics: {
    monthlyUsage: [],
    typeDistribution: [],
    topPerformingCoupons: [],
  },
};

const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    setCoupons: (state, action: PayloadAction<{ coupons: Coupon[]; couponUsage: CouponUsage[] }>) => {
      state.coupons = action.payload.coupons;
      state.couponUsage = action.payload.couponUsage;
      state.totalCount = action.payload.coupons.length;
      state.activeCount = action.payload.coupons.filter(c => c.status === 'active').length;
      state.totalDiscountGiven = action.payload.coupons.reduce((sum, c) => sum + c.analytics.totalDiscount, 0);
      state.totalRevenueGenerated = action.payload.coupons.reduce((sum, c) => sum + c.analytics.totalRevenue, 0);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addCoupon: (state, action: PayloadAction<Coupon>) => {
      state.coupons.unshift(action.payload);
      state.totalCount += 1;
      if (action.payload.status === 'active') {
        state.activeCount += 1;
      }
    },
    updateCoupon: (state, action: PayloadAction<Coupon>) => {
      const index = state.coupons.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        const oldCoupon = state.coupons[index];
        const wasActive = oldCoupon.status === 'active';
        const isActive = action.payload.status === 'active';
        
        state.coupons[index] = action.payload;
        
        // Update active count
        if (wasActive && !isActive) {
          state.activeCount -= 1;
        } else if (!wasActive && isActive) {
          state.activeCount += 1;
        }
      }
    },
    updateCouponStatus: (state, action: PayloadAction<{ couponId: string; status: Coupon['status'] }>) => {
      const coupon = state.coupons.find(c => c.id === action.payload.couponId);
      if (coupon) {
        const wasActive = coupon.status === 'active';
        coupon.status = action.payload.status;
        coupon.updatedAt = new Date().toISOString();
        
        const isActive = action.payload.status === 'active';
        
        // Update active count
        if (wasActive && !isActive) {
          state.activeCount -= 1;
        } else if (!wasActive && isActive) {
          state.activeCount += 1;
        }
      }
    },
    deleteCoupon: (state, action: PayloadAction<string>) => {
      const couponIndex = state.coupons.findIndex(c => c.id === action.payload);
      if (couponIndex !== -1) {
        const coupon = state.coupons[couponIndex];
        if (coupon.status === 'active') {
          state.activeCount -= 1;
        }
        state.coupons.splice(couponIndex, 1);
        state.totalCount -= 1;
        
        // Remove associated usage records
        state.couponUsage = state.couponUsage.filter(usage => usage.couponId !== action.payload);
      }
    },
    useCoupon: (state, action: PayloadAction<{ couponId: string; usage: CouponUsage }>) => {
      const coupon = state.coupons.find(c => c.id === action.payload.couponId);
      if (coupon) {
        coupon.usedCount += 1;
        coupon.analytics.totalUsage += 1;
        coupon.analytics.totalRevenue += action.payload.usage.orderAmount;
        coupon.analytics.totalDiscount += action.payload.usage.discountAmount;
        
        // Recalculate average order value
        coupon.analytics.averageOrderValue = coupon.analytics.totalRevenue / coupon.analytics.totalUsage;
        
        // Add usage record
        state.couponUsage.unshift(action.payload.usage);
        
        // Check if coupon should be deactivated (usage limit reached)
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
          coupon.status = 'inactive';
          state.activeCount -= 1;
        }
      }
    },
    expireCoupons: (state) => {
      const now = new Date().toISOString();
      state.coupons.forEach(coupon => {
        if (coupon.status === 'active' && coupon.endDate < now) {
          coupon.status = 'expired';
          state.activeCount -= 1;
        }
      });
    },
    setAnalytics: (state, action: PayloadAction<CouponState['analytics']>) => {
      state.analytics = action.payload;
    },
    incrementCouponUsage: (state, action: PayloadAction<{ couponId: string; discountAmount: number; orderAmount: number }>) => {
      const coupon = state.coupons.find(c => c.id === action.payload.couponId);
      if (coupon) {
        coupon.usedCount += 1;
        coupon.analytics.totalUsage += 1;
        coupon.analytics.totalRevenue += action.payload.orderAmount;
        coupon.analytics.totalDiscount += action.payload.discountAmount;
        coupon.analytics.averageOrderValue = coupon.analytics.totalRevenue / coupon.analytics.totalUsage;
        
        // Update global totals
        state.totalDiscountGiven += action.payload.discountAmount;
        state.totalRevenueGenerated += action.payload.orderAmount;
      }
    },
  },
});

export const {
  setCoupons,
  setLoading,
  addCoupon,
  updateCoupon,
  updateCouponStatus,
  deleteCoupon,
  useCoupon,
  expireCoupons,
  setAnalytics,
  incrementCouponUsage,
} = couponSlice.actions;

export default couponSlice.reducer;
