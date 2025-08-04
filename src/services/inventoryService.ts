import api from './api';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
  variants: Array<{
    id: string;
    size?: string;
    color?: string;
    quantity: number;
    lowStockThreshold?: number;
  }>;
  totalQuantity: number;
  lowStockCount: number;
  outOfStockCount: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export interface InventoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  lowStock?: string;
  outOfStock?: string;
}

export interface InventoryStats {
  totalStock: number;
  outOfStockVariants: number;
  lowStockVariants: number;
  totalProducts: number;
}

export interface UpdateInventoryData {
  quantity: number;
  lowStockThreshold?: number;
}

class InventoryService {
  // Get inventory overview with filters
  async getInventoryOverview(filters: InventoryFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/admin/inventory?${params.toString()}`);
    return response.data;
  }

  // Update variant inventory
  async updateVariantInventory(variantId: string, data: UpdateInventoryData) {
    const response = await api.patch(`/admin/inventory/variant/${variantId}`, data);
    return response.data;
  }

  // Get inventory statistics
  async getInventoryStats(): Promise<{ data: InventoryStats }> {
    const response = await api.get('/admin/inventory/stats');
    return response.data;
  }
}

export default new InventoryService();
