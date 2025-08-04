import api from './api';

export interface SEOPage {
  id: string;
  pageName: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  robots?: string;
  structuredData?: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSEOData {
  pageName: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  robots?: 'index,follow' | 'noindex,nofollow' | 'index,nofollow' | 'noindex,follow';
  structuredData?: any;
}

export interface UpdateSEOData {
  pageName?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  robots?: 'index,follow' | 'noindex,nofollow' | 'index,nofollow' | 'noindex,follow';
  structuredData?: any;
}

export interface SEOFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface SEOStats {
  totalPages: number;
  completionRates: {
    metaTitle: number;
    metaDescription: number;
    openGraph: number;
    canonical: number;
  };
  overallScore: number;
}

export interface SEORecommendation {
  type: 'error' | 'warning' | 'info';
  field: string;
  message: string;
}

class SEOService {
  // Get all SEO pages with filters
  async getAllSEOPages(filters: SEOFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/admin/seo?${params.toString()}`);
    return response.data;
  }

  // Get single SEO page by ID
  async getSEOPageById(id: string) {
    const response = await api.get(`/admin/seo/${id}`);
    return response.data;
  }

  // Get SEO page by page name
  async getSEOPageByName(pageName: string) {
    const response = await api.get(`/admin/seo/page/${pageName}`);
    return response.data;
  }

  // Create new SEO page
  async createSEOPage(data: CreateSEOData) {
    const response = await api.post('/admin/seo', data);
    return response.data;
  }

  // Update SEO page
  async updateSEOPage(id: string, data: UpdateSEOData) {
    const response = await api.put(`/admin/seo/${id}`, data);
    return response.data;
  }

  // Delete SEO page
  async deleteSEOPage(id: string) {
    const response = await api.delete(`/admin/seo/${id}`);
    return response.data;
  }

  // Generate SEO recommendations
  async generateSEORecommendations(id: string): Promise<{ data: { recommendations: SEORecommendation[]; score: number } }> {
    const response = await api.get(`/admin/seo/${id}/recommendations`);
    return response.data;
  }

  // Get SEO statistics
  async getSEOStats(): Promise<{ data: SEOStats }> {
    const response = await api.get('/admin/seo/stats');
    return response.data;
  }
}

export default new SEOService();
