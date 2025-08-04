import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import seoService, { SEOPage, CreateSEOData, UpdateSEOData, SEOFilters, SEOStats, SEORecommendation } from '../../services/seoService';

interface SEOState {
  seoPages: SEOPage[];
  currentSEOPage: SEOPage | null;
  stats: SEOStats | null;
  recommendations: SEORecommendation[];
  recommendationScore: number;
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

const initialState: SEOState = {
  seoPages: [],
  currentSEOPage: null,
  stats: null,
  recommendations: [],
  recommendationScore: 0,
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
export const fetchSEOPages = createAsyncThunk(
  'seo/fetchSEOPages',
  async (filters: SEOFilters = {}) => {
    const response = await seoService.getAllSEOPages(filters);
    return response;
  }
);

export const fetchSEOPageById = createAsyncThunk(
  'seo/fetchSEOPageById',
  async (id: string) => {
    const response = await seoService.getSEOPageById(id);
    return response;
  }
);

export const fetchSEOPageByName = createAsyncThunk(
  'seo/fetchSEOPageByName',
  async (pageName: string) => {
    const response = await seoService.getSEOPageByName(pageName);
    return response;
  }
);

export const createSEOPage = createAsyncThunk(
  'seo/createSEOPage',
  async (data: CreateSEOData) => {
    const response = await seoService.createSEOPage(data);
    return response;
  }
);

export const updateSEOPage = createAsyncThunk(
  'seo/updateSEOPage',
  async ({ id, data }: { id: string; data: UpdateSEOData }) => {
    const response = await seoService.updateSEOPage(id, data);
    return response;
  }
);

export const deleteSEOPage = createAsyncThunk(
  'seo/deleteSEOPage',
  async (id: string) => {
    await seoService.deleteSEOPage(id);
    return id;
  }
);

export const generateSEORecommendations = createAsyncThunk(
  'seo/generateSEORecommendations',
  async (id: string) => {
    const response = await seoService.generateSEORecommendations(id);
    return response;
  }
);

export const fetchSEOStats = createAsyncThunk(
  'seo/fetchSEOStats',
  async () => {
    const response = await seoService.getSEOStats();
    return response;
  }
);

const seoSlice = createSlice({
  name: 'seo',
  initialState,
  reducers: {
    clearCurrentSEOPage: (state) => {
      state.currentSEOPage = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearRecommendations: (state) => {
      state.recommendations = [];
      state.recommendationScore = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch SEO pages
      .addCase(fetchSEOPages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSEOPages.fulfilled, (state, action) => {
        state.loading = false;
        state.seoPages = action.payload.data.seoPages;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchSEOPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch SEO pages';
      })

      // Fetch SEO page by ID
      .addCase(fetchSEOPageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSEOPageById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSEOPage = action.payload.data;
      })
      .addCase(fetchSEOPageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch SEO page';
      })

      // Fetch SEO page by name
      .addCase(fetchSEOPageByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSEOPageByName.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSEOPage = action.payload.data;
      })
      .addCase(fetchSEOPageByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch SEO page';
      })

      // Create SEO page
      .addCase(createSEOPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSEOPage.fulfilled, (state, action) => {
        state.loading = false;
        state.seoPages.unshift(action.payload.data);
      })
      .addCase(createSEOPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create SEO page';
      })

      // Update SEO page
      .addCase(updateSEOPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSEOPage.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.seoPages.findIndex(page => page.id === action.payload.data.id);
        if (index !== -1) {
          state.seoPages[index] = action.payload.data;
        }
        if (state.currentSEOPage?.id === action.payload.data.id) {
          state.currentSEOPage = action.payload.data;
        }
      })
      .addCase(updateSEOPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update SEO page';
      })

      // Delete SEO page
      .addCase(deleteSEOPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSEOPage.fulfilled, (state, action) => {
        state.loading = false;
        state.seoPages = state.seoPages.filter(page => page.id !== action.payload);
        if (state.currentSEOPage?.id === action.payload) {
          state.currentSEOPage = null;
        }
      })
      .addCase(deleteSEOPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete SEO page';
      })

      // Generate SEO recommendations
      .addCase(generateSEORecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateSEORecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload.data.recommendations;
        state.recommendationScore = action.payload.data.score;
      })
      .addCase(generateSEORecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate SEO recommendations';
      })

      // Fetch SEO stats
      .addCase(fetchSEOStats.fulfilled, (state, action) => {
        state.stats = action.payload.data;
      });
  }
});

export const { clearCurrentSEOPage, clearError, clearRecommendations } = seoSlice.actions;
export default seoSlice.reducer;
