import api from './api';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
  products?: {
    id: string;
    name: string;
    slug: string;
    price: number;
    isActive: boolean;
    stockQuantity: number;
    images?: {
      url: string;
      alt?: string;
    }[];
  }[];
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

export interface CategoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CategoryStats {
  totalCategories: number;
  activeCategories: number;
  categoriesWithProducts: number;
  newCategoriesThisMonth: number;
  topCategories: {
    id: string;
    name: string;
    _count: {
      products: number;
    };
  }[];
}

class CategoryService {
  // Get all categories with pagination and filters
  async getAllCategories(filters: CategoryFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/admin/categories?${params.toString()}`);
    return response.data;
  }

  // Get category by ID
  async getCategoryById(id: string) {
    const response = await api.get(`/admin/categories/${id}`);
    return response.data;
  }

  // Create new category
  async createCategory(categoryData: CreateCategoryData) {
    const response = await api.post('/admin/categories', categoryData);
    return response.data;
  }

  // Update category
  async updateCategory(id: string, categoryData: UpdateCategoryData) {
    const response = await api.put(`/admin/categories/${id}`, categoryData);
    return response.data;
  }

  // Delete category
  async deleteCategory(id: string) {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  }

  // Toggle category status
  async toggleCategoryStatus(id: string) {
    const response = await api.patch(`/admin/categories/${id}/toggle-status`);
    return response.data;
  }

  // Get category statistics
  async getCategoryStats(): Promise<{ success: boolean; data: CategoryStats }> {
    const response = await api.get('/admin/categories/stats');
    return response.data;
  }

  // Reorder categories
  async reorderCategories(categoryOrders: { id: string; sortOrder: number }[]) {
    const response = await api.patch('/admin/categories/reorder', {
      categoryOrders,
    });
    return response.data;
  }

  // Get all categories for dropdown (simplified)
  async getCategoriesForDropdown() {
    const response = await api.get('/admin/categories?limit=1000&sortBy=name&sortOrder=asc');
    return response.data.data.categories.map((cat: Category) => ({
      value: cat.id,
      label: cat.name,
      disabled: !cat.isActive,
    }));
  }
}

export const categoryService = new CategoryService();
export default categoryService;
