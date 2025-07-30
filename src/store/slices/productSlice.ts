import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductVariant {
  id: string;
  size: string;
  color: string;
  sku: string;
  stock: number;
  price: number;
  discount: number;
  images: string[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  variants: ProductVariant[];
  tags: string[];
  status: 'draft' | 'live' | 'out_of_stock';
  seo: {
    title: string;
    description: string;
    url: string;
  };
  attributes: {
    material: string;
    fit: string;
    fabric: string;
  };
  faqs: Array<{ question: string; answer: string }>;
  createdAt: string;
  updatedAt: string;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  totalCount: number;
  categories: string[];
}

const initialState: ProductState = {
  products: [],
  loading: false,
  totalCount: 0,
  categories: ['Clothing', 'Accessories', 'Footwear', 'Bags'],
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.unshift(action.payload);
      state.totalCount += 1;
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.id !== action.payload);
      state.totalCount -= 1;
    },
  },
});

export const { setProducts, setLoading, addProduct, updateProduct, deleteProduct } = productSlice.actions;
export default productSlice.reducer;