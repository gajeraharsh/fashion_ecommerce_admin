import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { productService, Product as ProductServiceType, ProductFilters, ProductStats } from '../../services/productService';

// Use the Product interface from the service
type Product = ProductServiceType;

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  stats: ProductStats | null;
  categories: string[];
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  totalCount: 0,
  stats: null,
  categories: [],
};

// Async thunks for API calls
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters: ProductFilters = {}) => {
    const response = await productService.getAllProducts(filters);
    return response;
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: string) => {
    const response = await productService.getProductById(id);
    return response;
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: any) => {
    const response = await productService.createProduct(productData);
    return response;
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }: { id: string; productData: any }) => {
    const response = await productService.updateProduct(id, productData);
    return response;
  }
);

export const deleteProductAsync = createAsyncThunk(
  'products/deleteProduct',
  async (id: string) => {
    await productService.deleteProduct(id);
    return id;
  }
);

export const fetchProductStats = createAsyncThunk(
  'products/fetchProductStats',
  async () => {
    const response = await productService.getProductStats();
    return response;
  }
);

export const bulkUpdateProducts = createAsyncThunk(
  'products/bulkUpdateProducts',
  async ({ productIds, updateData }: { productIds: string[]; updateData: any }) => {
    const response = await productService.bulkUpdateProducts(productIds, updateData);
    return response;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data?.products || [];
        state.totalCount = action.payload.data?.totalCount || 0;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        // Update or add the product to the list
        const product = action.payload.data;
        const index = state.products.findIndex(p => p.id === product.id);
        if (index !== -1) {
          state.products[index] = product;
        } else {
          state.products.push(product);
        }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch product';
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload.data);
        state.totalCount += 1;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create product';
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(p => p.id === action.payload.data.id);
        if (index !== -1) {
          state.products[index] = action.payload.data;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update product';
      })
      // Delete product
      .addCase(deleteProductAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(p => p.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(deleteProductAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete product';
      })
      // Fetch product stats
      .addCase(fetchProductStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchProductStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch product stats';
      })
      // Bulk update products
      .addCase(bulkUpdateProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkUpdateProducts.fulfilled, (state) => {
        state.loading = false;
        // Refresh products after bulk update
      })
      .addCase(bulkUpdateProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to bulk update products';
      });
  },
});

export const { clearError, setProducts } = productSlice.actions;
export default productSlice.reducer;