import api from './api';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  tags?: string[];
  categoryId?: string;
  isPublished: boolean;
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
  };
  comments?: any[];
  _count?: {
    comments: number;
  };
}

export interface CreateBlogData {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  tags?: string[];
  categoryId?: string;
  isPublished?: boolean;
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
}

export interface UpdateBlogData {
  title?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  tags?: string[];
  categoryId?: string;
  isPublished?: boolean;
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
}

export interface BlogFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  isPublished?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface BlogStats {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  blogsThisMonth: number;
  totalComments: number;
  approvedComments: number;
  categoryBreakdown: Array<{
    categoryId: string;
    _count: number;
    category?: {
      id: string;
      name: string;
    };
  }>;
}

class BlogService {
  // Get all blog posts with filters
  async getAllBlogs(filters: BlogFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/admin/blogs?${params.toString()}`);
    return response.data;
  }

  // Get single blog post by ID
  async getBlogById(id: string) {
    const response = await api.get(`/admin/blogs/${id}`);
    return response.data;
  }

  // Create new blog post
  async createBlog(data: CreateBlogData) {
    const response = await api.post('/admin/blogs', data);
    return response.data;
  }

  // Update blog post
  async updateBlog(id: string, data: UpdateBlogData) {
    const response = await api.put(`/admin/blogs/${id}`, data);
    return response.data;
  }

  // Delete blog post
  async deleteBlog(id: string) {
    const response = await api.delete(`/admin/blogs/${id}`);
    return response.data;
  }

  // Toggle blog post status
  async toggleBlogStatus(id: string) {
    const response = await api.patch(`/admin/blogs/${id}/toggle-status`);
    return response.data;
  }

  // Bulk update blog posts
  async bulkUpdateBlogs(blogIds: string[], action: 'publish' | 'unpublish' | 'delete') {
    const response = await api.patch('/admin/blogs/bulk-update', {
      blogIds,
      action
    });
    return response.data;
  }

  // Get blog statistics
  async getBlogStats(): Promise<{ data: BlogStats }> {
    const response = await api.get('/admin/blogs/stats');
    return response.data;
  }
}

export default new BlogService();
