import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import faqService, { FAQ, CreateFAQData, UpdateFAQData, FAQFilters, FAQStats } from '../../services/faqService';

interface FAQState {
  faqs: FAQ[];
  currentFAQ: FAQ | null;
  categories: string[];
  stats: FAQStats | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const initialState: FAQState = {
  faqs: [],
  currentFAQ: null,
  categories: [],
  stats: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  }
};

// Async thunks
export const fetchFAQs = createAsyncThunk(
  'faq/fetchFAQs',
  async (filters: FAQFilters = {}) => {
    const response = await faqService.getAllFAQs(filters);
    return response;
  }
);

export const fetchFAQById = createAsyncThunk(
  'faq/fetchFAQById',
  async (id: string) => {
    const response = await faqService.getFAQById(id);
    return response;
  }
);

export const createFAQ = createAsyncThunk(
  'faq/createFAQ',
  async (data: CreateFAQData) => {
    const response = await faqService.createFAQ(data);
    return response;
  }
);

export const updateFAQ = createAsyncThunk(
  'faq/updateFAQ',
  async ({ id, data }: { id: string; data: UpdateFAQData }) => {
    const response = await faqService.updateFAQ(id, data);
    return response;
  }
);

export const deleteFAQ = createAsyncThunk(
  'faq/deleteFAQ',
  async (id: string) => {
    await faqService.deleteFAQ(id);
    return id;
  }
);

export const toggleFAQStatus = createAsyncThunk(
  'faq/toggleFAQStatus',
  async (id: string) => {
    const response = await faqService.toggleFAQStatus(id);
    return response;
  }
);

export const reorderFAQs = createAsyncThunk(
  'faq/reorderFAQs',
  async (faqOrders: Array<{ id: string; sortOrder: number }>) => {
    await faqService.reorderFAQs(faqOrders);
    return faqOrders;
  }
);

export const fetchFAQCategories = createAsyncThunk(
  'faq/fetchFAQCategories',
  async () => {
    const response = await faqService.getFAQCategories();
    return response;
  }
);

export const fetchFAQStats = createAsyncThunk(
  'faq/fetchFAQStats',
  async () => {
    const response = await faqService.getFAQStats();
    return response;
  }
);

const faqSlice = createSlice({
  name: 'faq',
  initialState,
  reducers: {
    clearCurrentFAQ: (state) => {
      state.currentFAQ = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch FAQs
      .addCase(fetchFAQs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFAQs.fulfilled, (state, action) => {
        state.loading = false;
        state.faqs = action.payload.data.faqs;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchFAQs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch FAQs';
      })

      // Fetch FAQ by ID
      .addCase(fetchFAQById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFAQById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFAQ = action.payload.data;
      })
      .addCase(fetchFAQById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch FAQ';
      })

      // Create FAQ
      .addCase(createFAQ.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFAQ.fulfilled, (state, action) => {
        state.loading = false;
        state.faqs.unshift(action.payload.data);
      })
      .addCase(createFAQ.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create FAQ';
      })

      // Update FAQ
      .addCase(updateFAQ.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFAQ.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.faqs.findIndex(faq => faq.id === action.payload.data.id);
        if (index !== -1) {
          state.faqs[index] = action.payload.data;
        }
        if (state.currentFAQ?.id === action.payload.data.id) {
          state.currentFAQ = action.payload.data;
        }
      })
      .addCase(updateFAQ.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update FAQ';
      })

      // Delete FAQ
      .addCase(deleteFAQ.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFAQ.fulfilled, (state, action) => {
        state.loading = false;
        state.faqs = state.faqs.filter(faq => faq.id !== action.payload);
        if (state.currentFAQ?.id === action.payload) {
          state.currentFAQ = null;
        }
      })
      .addCase(deleteFAQ.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete FAQ';
      })

      // Toggle FAQ status
      .addCase(toggleFAQStatus.fulfilled, (state, action) => {
        const index = state.faqs.findIndex(faq => faq.id === action.payload.data.id);
        if (index !== -1) {
          state.faqs[index] = action.payload.data;
        }
        if (state.currentFAQ?.id === action.payload.data.id) {
          state.currentFAQ = action.payload.data;
        }
      })

      // Reorder FAQs
      .addCase(reorderFAQs.fulfilled, (state, action) => {
        action.payload.forEach(({ id, sortOrder }) => {
          const faq = state.faqs.find(f => f.id === id);
          if (faq) {
            faq.sortOrder = sortOrder;
          }
        });
        state.faqs.sort((a, b) => a.sortOrder - b.sortOrder);
      })

      // Fetch FAQ categories
      .addCase(fetchFAQCategories.fulfilled, (state, action) => {
        state.categories = action.payload.data;
      })

      // Fetch FAQ stats
      .addCase(fetchFAQStats.fulfilled, (state, action) => {
        state.stats = action.payload.data;
      });
  }
});

export const { clearCurrentFAQ, clearError } = faqSlice.actions;
export default faqSlice.reducer;
