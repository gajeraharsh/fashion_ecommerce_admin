import api from './api';

export interface InstagramPost {
  id: string;
  postId: string;
  imageUrl: string;
  caption?: string;
  permalink?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInstagramPostData {
  postId: string;
  imageUrl: string;
  caption?: string;
  permalink?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateInstagramPostData {
  postId?: string;
  imageUrl?: string;
  caption?: string;
  permalink?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface InstagramFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface InstagramStats {
  totalPosts: number;
  activePosts: number;
  inactivePosts: number;
}

class InstagramService {
  // Get all Instagram posts with filters
  async getAllInstagramPosts(filters: InstagramFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/admin/instagram?${params.toString()}`);
    return response.data;
  }

  // Get single Instagram post by ID
  async getInstagramPostById(id: string) {
    const response = await api.get(`/admin/instagram/${id}`);
    return response.data;
  }

  // Create new Instagram post
  async createInstagramPost(data: CreateInstagramPostData) {
    const response = await api.post('/admin/instagram', data);
    return response.data;
  }

  // Update Instagram post
  async updateInstagramPost(id: string, data: UpdateInstagramPostData) {
    const response = await api.put(`/admin/instagram/${id}`, data);
    return response.data;
  }

  // Delete Instagram post
  async deleteInstagramPost(id: string) {
    const response = await api.delete(`/admin/instagram/${id}`);
    return response.data;
  }

  // Toggle Instagram post status
  async toggleInstagramPostStatus(id: string) {
    const response = await api.patch(`/admin/instagram/${id}/toggle-status`);
    return response.data;
  }

  // Reorder Instagram posts
  async reorderInstagramPosts(postOrders: Array<{ id: string; sortOrder: number }>) {
    const response = await api.patch('/admin/instagram/reorder', { postOrders });
    return response.data;
  }

  // Bulk update Instagram posts
  async bulkUpdateInstagramPosts(postIds: string[], action: 'activate' | 'deactivate' | 'delete') {
    const response = await api.patch('/admin/instagram/bulk-update', {
      postIds,
      action
    });
    return response.data;
  }

  // Get Instagram statistics
  async getInstagramStats(): Promise<{ data: InstagramStats }> {
    const response = await api.get('/admin/instagram/stats');
    return response.data;
  }

  // Sync with Instagram API
  async syncWithInstagram() {
    const response = await api.post('/admin/instagram/sync');
    return response.data;
  }
}

export default new InstagramService();
