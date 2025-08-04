import api from './api';

export interface Newsletter {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt?: string;
  source?: string;
}

export interface CreateNewsletterData {
  email: string;
  source?: string;
  isActive?: boolean;
}

export interface UpdateNewsletterData {
  isActive?: boolean;
}

export interface NewsletterFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: string;
  source?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface NewsletterStats {
  totalSubscribers: number;
  activeSubscribers: number;
  unsubscribed: number;
  newThisMonth: number;
  sourceBreakdown: Array<{
    source: string;
    _count: number;
  }>;
}

class NewsletterService {
  // Get all subscribers with filters
  async getAllSubscribers(filters: NewsletterFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/admin/newsletter?${params.toString()}`);
    return response.data;
  }

  // Get single subscriber by ID
  async getSubscriberById(id: string) {
    const response = await api.get(`/admin/newsletter/${id}`);
    return response.data;
  }

  // Create new subscriber
  async createSubscriber(data: CreateNewsletterData) {
    const response = await api.post('/admin/newsletter', data);
    return response.data;
  }

  // Update subscriber
  async updateSubscriber(id: string, data: UpdateNewsletterData) {
    const response = await api.put(`/admin/newsletter/${id}`, data);
    return response.data;
  }

  // Delete subscriber
  async deleteSubscriber(id: string) {
    const response = await api.delete(`/admin/newsletter/${id}`);
    return response.data;
  }

  // Toggle subscriber status
  async toggleSubscriberStatus(id: string) {
    const response = await api.patch(`/admin/newsletter/${id}/toggle-status`);
    return response.data;
  }

  // Bulk update subscribers
  async bulkUpdateSubscribers(subscriberIds: string[], action: 'subscribe' | 'unsubscribe' | 'delete') {
    const response = await api.patch('/admin/newsletter/bulk-update', {
      subscriberIds,
      action
    });
    return response.data;
  }

  // Get newsletter statistics
  async getNewsletterStats(): Promise<{ data: NewsletterStats }> {
    const response = await api.get('/admin/newsletter/stats');
    return response.data;
  }

  // Export subscribers
  async exportSubscribers(isActive?: boolean) {
    const params = new URLSearchParams();
    if (isActive !== undefined) {
      params.append('isActive', isActive.toString());
    }

    const response = await api.get(`/admin/newsletter/export?${params.toString()}`, {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'newsletter-subscribers.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true, message: 'Export completed' };
  }
}

export default new NewsletterService();
