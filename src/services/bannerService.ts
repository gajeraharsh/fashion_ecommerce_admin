import api from './api';

export interface Banner {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  position: 'HERO' | 'SIDEBAR' | 'FOOTER' | 'POPUP' | 'CATEGORY';
  isActive: boolean;
  sortOrder: number;
  startDate?: string;
  endDate?: string;
  targetAudience: 'ALL' | 'NEW_USERS' | 'RETURNING_USERS' | 'VIP';
  clickCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBannerData {
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  position: 'HERO' | 'SIDEBAR' | 'FOOTER' | 'POPUP' | 'CATEGORY';
  isActive?: boolean;
  sortOrder?: number;
  startDate?: string;
  endDate?: string;
  targetAudience?: 'ALL' | 'NEW_USERS' | 'RETURNING_USERS' | 'VIP';
}

export interface UpdateBannerData {
  title?: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  position?: 'HERO' | 'SIDEBAR' | 'FOOTER' | 'POPUP' | 'CATEGORY';
  isActive?: boolean;
  sortOrder?: number;
  startDate?: string;
  endDate?: string;
  targetAudience?: 'ALL' | 'NEW_USERS' | 'RETURNING_USERS' | 'VIP';
}

export interface BannerFilters {
  page?: number;
  limit?: number;
  search?: string;
  position?: string;
  isActive?: string;
  targetAudience?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface BannerStats {
  totalBanners: number;
  activeBanners: number;
  positionBreakdown: Array<{
    position: string;
    _count: number;
  }>;
  audienceBreakdown: Array<{
    targetAudience: string;
    _count: number;
  }>;
  totalClicks: number;
  topPerformingBanners: Array<{
    id: string;
    title: string;
    clickCount: number;
    position: string;
  }>;
}

class BannerService {
  // Get all banners with filters
  async getAllBanners(filters: BannerFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/admin/banners?${params.toString()}`);
    return response.data;
  }

  // Get single banner by ID
  async getBannerById(id: string) {
    const response = await api.get(`/admin/banners/${id}`);
    return response.data;
  }

  // Create new banner
  async createBanner(data: CreateBannerData) {
    const response = await api.post('/admin/banners', data);
    return response.data;
  }

  // Update banner
  async updateBanner(id: string, data: UpdateBannerData) {
    const response = await api.put(`/admin/banners/${id}`, data);
    return response.data;
  }

  // Delete banner
  async deleteBanner(id: string) {
    const response = await api.delete(`/admin/banners/${id}`);
    return response.data;
  }

  // Toggle banner status
  async toggleBannerStatus(id: string) {
    const response = await api.patch(`/admin/banners/${id}/toggle-status`);
    return response.data;
  }

  // Reorder banners
  async reorderBanners(bannerOrders: Array<{ id: string; sortOrder: number }>) {
    const response = await api.patch('/admin/banners/reorder', { bannerOrders });
    return response.data;
  }

  // Bulk update banners
  async bulkUpdateBanners(bannerIds: string[], action: 'activate' | 'deactivate' | 'delete') {
    const response = await api.patch('/admin/banners/bulk-update', {
      bannerIds,
      action
    });
    return response.data;
  }

  // Track banner click
  async trackBannerClick(id: string) {
    const response = await api.patch(`/admin/banners/${id}/track-click`);
    return response.data;
  }

  // Get banner statistics
  async getBannerStats(): Promise<{ data: BannerStats }> {
    const response = await api.get('/admin/banners/stats');
    return response.data;
  }

  // Get active banners by position
  async getActiveBannersByPosition(position: string) {
    const response = await api.get(`/admin/banners/position/${position}`);
    return response.data;
  }
}

export default new BannerService();
