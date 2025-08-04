import api from './api';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  categoryId: string;
  brandId?: string;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isTrending: boolean;
  stockQuantity: number;
  lowStockThreshold: number;
  metaTitle?: string;
  metaDescription?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  brand?: {
    id: string;
    name: string;
    slug: string;
  };
  images?: ProductImage[];
  variants?: ProductVariant[];
  _count?: {
    reviews: number;
    cartItems: number;
    wishlistItems: number;
    orderItems: number;
  };
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price?: number;
  comparePrice?: number;
  costPrice?: number;
  sku?: string;
  barcode?: string;
  stockQuantity: number;
  isActive: boolean;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  categoryId: string;
  brandId?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
  stockQuantity?: number;
  lowStockThreshold?: number;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export interface CreateVariantData {
  name: string;
  value: string;
  price?: number;
  comparePrice?: number;
  costPrice?: number;
  sku?: string;
  barcode?: string;
  stockQuantity?: number;
  isActive?: boolean;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  brandId?: string;
  isActive?: string;
  isFeatured?: string;
  isNew?: string;
  isTrending?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  featuredProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  newProductsThisMonth: number;
}

class ProductService {
  // Get all products with pagination and filters
  async getAllProducts(filters: ProductFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/admin/products?${params.toString()}`);
    return response.data;
  }

  // Get product by ID
  async getProductById(id: string) {
    const response = await api.get(`/admin/products/${id}`);
    return response.data;
  }

  // Create new product
  async createProduct(productData: CreateProductData) {
    const response = await api.post('/admin/products', productData);
    return response.data;
  }

  // Update product
  async updateProduct(id: string, productData: UpdateProductData) {
    const response = await api.put(`/admin/products/${id}`, productData);
    return response.data;
  }

  // Delete product
  async deleteProduct(id: string) {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  }

  // Add product images
  async addProductImages(id: string, images: FormData) {
    const response = await api.post(`/admin/products/${id}/images`, images, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Create product variant
  async createProductVariant(productId: string, variantData: CreateVariantData) {
    const response = await api.post(`/admin/products/${productId}/variants`, variantData);
    return response.data;
  }

  // Get product statistics
  async getProductStats(): Promise<{ success: boolean; data: ProductStats }> {
    const response = await api.get('/admin/products/stats');
    return response.data;
  }

  // Bulk update products
  async bulkUpdateProducts(productIds: string[], updateData: Partial<Product>) {
    const response = await api.patch('/admin/products/bulk-update', {
      productIds,
      updateData,
    });
    return response.data;
  }

  // Upload product image
  async uploadProductImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data.url;
  }
}

export const productService = new ProductService();
export default productService;
