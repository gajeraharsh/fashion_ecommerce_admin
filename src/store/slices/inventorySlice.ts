import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  costPrice: number;
  sellingPrice: number;
  supplier: string;
  supplierId: string;
  location: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
  lastRestocked: string;
  expiryDate?: string;
  batchNumber?: string;
  totalValue: number;
  reservedStock: number;
  availableStock: number;
  image?: string;
  movements: Array<{
    id: string;
    type: 'in' | 'out' | 'adjustment';
    quantity: number;
    reason: string;
    date: string;
    reference?: string;
  }>;
}

interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  items: Array<{
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }>;
  status: 'draft' | 'sent' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  orderDate: string;
  expectedDate?: string;
  deliveredDate?: string;
  notes?: string;
}

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: string;
  leadTime: number;
  rating: number;
  status: 'active' | 'inactive';
}

interface InventoryState {
  inventory: InventoryItem[];
  purchaseOrders: PurchaseOrder[];
  suppliers: Supplier[];
  loading: boolean;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
}

const initialState: InventoryState = {
  inventory: [],
  purchaseOrders: [],
  suppliers: [],
  loading: false,
  totalValue: 0,
  lowStockCount: 0,
  outOfStockCount: 0,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setInventory: (state, action: PayloadAction<{ inventory: InventoryItem[]; purchaseOrders: PurchaseOrder[]; suppliers: Supplier[] }>) => {
      state.inventory = action.payload.inventory;
      state.purchaseOrders = action.payload.purchaseOrders;
      state.suppliers = action.payload.suppliers;
      
      // Calculate derived values
      state.totalValue = action.payload.inventory.reduce((sum, item) => sum + item.totalValue, 0);
      state.lowStockCount = action.payload.inventory.filter(item => item.currentStock <= item.minStock).length;
      state.outOfStockCount = action.payload.inventory.filter(item => item.currentStock === 0).length;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addInventoryItem: (state, action: PayloadAction<InventoryItem>) => {
      state.inventory.unshift(action.payload);
    },
    updateInventoryItem: (state, action: PayloadAction<InventoryItem>) => {
      const index = state.inventory.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.inventory[index] = action.payload;
        
        // Update status based on stock levels
        const item = state.inventory[index];
        if (item.currentStock === 0) {
          item.status = 'out_of_stock';
        } else if (item.currentStock <= item.minStock) {
          item.status = 'low_stock';
        } else {
          item.status = 'in_stock';
        }
      }
      
      // Recalculate derived values
      state.totalValue = state.inventory.reduce((sum, item) => sum + item.totalValue, 0);
      state.lowStockCount = state.inventory.filter(item => item.currentStock <= item.minStock).length;
      state.outOfStockCount = state.inventory.filter(item => item.currentStock === 0).length;
    },
    deleteInventoryItem: (state, action: PayloadAction<string>) => {
      state.inventory = state.inventory.filter(item => item.id !== action.payload);
    },
    addPurchaseOrder: (state, action: PayloadAction<PurchaseOrder>) => {
      state.purchaseOrders.unshift(action.payload);
    },
    updatePurchaseOrder: (state, action: PayloadAction<PurchaseOrder>) => {
      const index = state.purchaseOrders.findIndex(po => po.id === action.payload.id);
      if (index !== -1) {
        state.purchaseOrders[index] = action.payload;
      }
    },
    updatePurchaseOrderStatus: (state, action: PayloadAction<{ orderId: string; status: PurchaseOrder['status'] }>) => {
      const order = state.purchaseOrders.find(po => po.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
        if (action.payload.status === 'delivered') {
          order.deliveredDate = new Date().toISOString();
        }
      }
    },
    addSupplier: (state, action: PayloadAction<Supplier>) => {
      state.suppliers.unshift(action.payload);
    },
    updateSupplier: (state, action: PayloadAction<Supplier>) => {
      const index = state.suppliers.findIndex(supplier => supplier.id === action.payload.id);
      if (index !== -1) {
        state.suppliers[index] = action.payload;
      }
    },
    deleteSupplier: (state, action: PayloadAction<string>) => {
      state.suppliers = state.suppliers.filter(supplier => supplier.id !== action.payload);
    },
    restockItem: (state, action: PayloadAction<{ itemId: string; quantity: number; reason: string; reference?: string }>) => {
      const item = state.inventory.find(i => i.id === action.payload.itemId);
      if (item) {
        item.currentStock += action.payload.quantity;
        item.availableStock += action.payload.quantity;
        item.totalValue = item.currentStock * item.costPrice;
        item.lastRestocked = new Date().toISOString();
        
        // Add movement record
        item.movements.push({
          id: `mov_${Date.now()}`,
          type: 'in',
          quantity: action.payload.quantity,
          reason: action.payload.reason,
          date: new Date().toISOString(),
          reference: action.payload.reference,
        });
        
        // Update status
        if (item.currentStock > item.minStock) {
          item.status = 'in_stock';
        } else {
          item.status = 'low_stock';
        }
      }
    },
    adjustStock: (state, action: PayloadAction<{ itemId: string; quantity: number; type: 'increase' | 'decrease'; reason: string }>) => {
      const item = state.inventory.find(i => i.id === action.payload.itemId);
      if (item) {
        const adjustment = action.payload.type === 'increase' ? action.payload.quantity : -action.payload.quantity;
        item.currentStock = Math.max(0, item.currentStock + adjustment);
        item.availableStock = Math.max(0, item.availableStock + adjustment);
        item.totalValue = item.currentStock * item.costPrice;
        
        // Add movement record
        item.movements.push({
          id: `mov_${Date.now()}`,
          type: 'adjustment',
          quantity: adjustment,
          reason: action.payload.reason,
          date: new Date().toISOString(),
        });
        
        // Update status
        if (item.currentStock === 0) {
          item.status = 'out_of_stock';
        } else if (item.currentStock <= item.minStock) {
          item.status = 'low_stock';
        } else {
          item.status = 'in_stock';
        }
      }
    },
  },
});

export const {
  setInventory,
  setLoading,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  addPurchaseOrder,
  updatePurchaseOrder,
  updatePurchaseOrderStatus,
  addSupplier,
  updateSupplier,
  deleteSupplier,
  restockItem,
  adjustStock,
} = inventorySlice.actions;

export default inventorySlice.reducer;
