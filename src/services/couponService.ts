import api from './api';

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  value: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  applicableCategories?: string[];
  applicableProducts?: string[];
  userRestrictions: 'ALL' | 'NEW_USERS' | 'EXISTING_USERS' | 'VIP';
  createdAt: string;
  updatedAt: string;
  _count?: {
    orders: number;
  };
}

export interface CreateCouponData {
  code: string;
  description?: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  value: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  usageLimit?: number;
  isActive?: boolean;
  startDate: string;
  endDate: string;
  applicableCategories?: string[];
  applicableProducts?: string[];
  userRestrictions?: 'ALL' | 'NEW_USERS' | 'EXISTING_USERS' | 'VIP';
}

export interface UpdateCouponData {
  code?: string;
  description?: string;
  type?: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  value?: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  usageLimit?: number;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  applicableCategories?: string[];
  applicableProducts?: string[];
  userRestrictions?: 'ALL' | 'NEW_USERS' | 'EXISTING_USERS' | 'VIP';
}

export interface CouponFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  isActive?: string;
  userRestrictions?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface CouponStats {
  totalCoupons: number;
  activeCoupons: number;
  expiredCoupons: number;
  couponsThisMonth: number;
  totalUsage: number;
  typeBreakdown: Array<{
    type: string;
    _count: number;
  }>;
  mostUsedCoupons: Array<{
    id: string;
    code: string;
    usageCount: number;
    type: string;
    value: number;
  }>;
}

class CouponService {
  // Get all coupons with filters
  async getAllCoupons(filters: CouponFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/admin/coupons?${params.toString()}`);
    return response.data;
  }

  // Get single coupon by ID
  async getCouponById(id: string) {
    const response = await api.get(`/admin/coupons/${id}`);
    return response.data;
  }

  // Create new coupon
  async createCoupon(data: CreateCouponData) {
    const response = await api.post('/admin/coupons', data);
    return response.data;
  }

  // Update coupon
  async updateCoupon(id: string, data: UpdateCouponData) {
    const response = await api.put(`/admin/coupons/${id}`, data);
    return response.data;
  }

  // Delete coupon
  async deleteCoupon(id: string) {
    const response = await api.delete(`/admin/coupons/${id}`);
    return response.data;
  }

  // Toggle coupon status
  async toggleCouponStatus(id: string) {
    const response = await api.patch(`/admin/coupons/${id}/toggle-status`);
    return response.data;
  }

  // Bulk update coupons
  async bulkUpdateCoupons(couponIds: string[], action: 'activate' | 'deactivate' | 'delete') {
    const response = await api.patch('/admin/coupons/bulk-update', {
      couponIds,
      action
    });
    return response.data;
  }

  // Validate coupon
  async validateCoupon(code: string, orderAmount?: number, userId?: string, categoryIds?: string[], productIds?: string[]) {
    const params = new URLSearchParams();
    if (orderAmount !== undefined) params.append('orderAmount', orderAmount.toString());
    if (userId) params.append('userId', userId);
    if (categoryIds?.length) categoryIds.forEach(id => params.append('categoryIds', id));
    if (productIds?.length) productIds.forEach(id => params.append('productIds', id));

    const response = await api.get(`/admin/coupons/validate/${code}?${params.toString()}`);
    return response.data;
  }

  // Get coupon statistics
  async getCouponStats(): Promise<{ data: CouponStats }> {
    const response = await api.get('/admin/coupons/stats');
    return response.data;
  }
}

export default new CouponService();
