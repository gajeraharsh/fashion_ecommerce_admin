import api from './api';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFAQData {
  question: string;
  answer: string;
  category?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateFAQData {
  question?: string;
  answer?: string;
  category?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface FAQFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isActive?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface FAQStats {
  totalFAQs: number;
  activeFAQs: number;
  categoryCounts: Array<{
    category: string;
    _count: number;
  }>;
}

class FAQService {
  // Get all FAQs with filters
  async getAllFAQs(filters: FAQFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/admin/faqs?${params.toString()}`);
    return response.data;
  }

  // Get single FAQ by ID
  async getFAQById(id: string) {
    const response = await api.get(`/admin/faqs/${id}`);
    return response.data;
  }

  // Create new FAQ
  async createFAQ(data: CreateFAQData) {
    const response = await api.post('/admin/faqs', data);
    return response.data;
  }

  // Update FAQ
  async updateFAQ(id: string, data: UpdateFAQData) {
    const response = await api.put(`/admin/faqs/${id}`, data);
    return response.data;
  }

  // Delete FAQ
  async deleteFAQ(id: string) {
    const response = await api.delete(`/admin/faqs/${id}`);
    return response.data;
  }

  // Toggle FAQ status
  async toggleFAQStatus(id: string) {
    const response = await api.patch(`/admin/faqs/${id}/toggle-status`);
    return response.data;
  }

  // Reorder FAQs
  async reorderFAQs(faqOrders: Array<{ id: string; sortOrder: number }>) {
    const response = await api.patch('/admin/faqs/reorder', { faqOrders });
    return response.data;
  }

  // Get FAQ categories
  async getFAQCategories() {
    const response = await api.get('/admin/faqs/categories');
    return response.data;
  }

  // Get FAQ statistics
  async getFAQStats(): Promise<{ data: FAQStats }> {
    const response = await api.get('/admin/faqs/stats');
    return response.data;
  }
}

export default new FAQService();
