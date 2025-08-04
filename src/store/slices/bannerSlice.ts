import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bannerService, { Banner, CreateBannerData, UpdateBannerData, BannerFilters, BannerStats } from '../../services/bannerService';

interface BannerState {
  banners: Banner[];
  currentBanner: Banner | null;
  stats: BannerStats | null;
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

const initialState: BannerState = {
  banners: [],
  currentBanner: null,
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
export const fetchBanners = createAsyncThunk(
  'banner/fetchBanners',
  async (filters: BannerFilters = {}) => {
    const response = await bannerService.getAllBanners(filters);
    return response;
  }
);

export const fetchBannerById = createAsyncThunk(
  'banner/fetchBannerById',
  async (id: string) => {
    const response = await bannerService.getBannerById(id);
    return response;
  }
);

export const createBanner = createAsyncThunk(
  'banner/createBanner',
  async (data: CreateBannerData) => {
    const response = await bannerService.createBanner(data);
    return response;
  }
);

export const updateBanner = createAsyncThunk(
  'banner/updateBanner',
  async ({ id, data }: { id: string; data: UpdateBannerData }) => {
    const response = await bannerService.updateBanner(id, data);
    return response;
  }
);

export const deleteBanner = createAsyncThunk(
  'banner/deleteBanner',
  async (id: string) => {
    await bannerService.deleteBanner(id);
    return id;
  }
);

export const toggleBannerStatus = createAsyncThunk(
  'banner/toggleBannerStatus',
  async (id: string) => {
    const response = await bannerService.toggleBannerStatus(id);
    return response;
  }
);

export const reorderBanners = createAsyncThunk(
  'banner/reorderBanners',
  async (bannerOrders: Array<{ id: string; sortOrder: number }>) => {
    await bannerService.reorderBanners(bannerOrders);
    return bannerOrders;
  }
);

export const bulkUpdateBanners = createAsyncThunk(
  'banner/bulkUpdateBanners',
  async ({ bannerIds, action }: { bannerIds: string[]; action: 'activate' | 'deactivate' | 'delete' }) => {
    const response = await bannerService.bulkUpdateBanners(bannerIds, action);
    return { response, bannerIds, action };
  }
);

export const fetchBannerStats = createAsyncThunk(
  'banner/fetchBannerStats',
  async () => {
    const response = await bannerService.getBannerStats();
    return response;
  }
);

const bannerSlice = createSlice({
  name: 'banner',
  initialState,
  reducers: {
    clearCurrentBanner: (state) => {
      state.currentBanner = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch banners
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload.data.banners;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch banners';
      })

      // Fetch banner by ID
      .addCase(fetchBannerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBannerById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBanner = action.payload.data;
      })
      .addCase(fetchBannerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch banner';
      })

      // Create banner
      .addCase(createBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners.unshift(action.payload.data);
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create banner';
      })

      // Update banner
      .addCase(updateBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.banners.findIndex(banner => banner.id === action.payload.data.id);
        if (index !== -1) {
          state.banners[index] = action.payload.data;
        }
        if (state.currentBanner?.id === action.payload.data.id) {
          state.currentBanner = action.payload.data;
        }
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update banner';
      })

      // Delete banner
      .addCase(deleteBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = state.banners.filter(banner => banner.id !== action.payload);
        if (state.currentBanner?.id === action.payload) {
          state.currentBanner = null;
        }
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete banner';
      })

      // Toggle banner status
      .addCase(toggleBannerStatus.fulfilled, (state, action) => {
        const index = state.banners.findIndex(banner => banner.id === action.payload.data.id);
        if (index !== -1) {
          state.banners[index] = action.payload.data;
        }
        if (state.currentBanner?.id === action.payload.data.id) {
          state.currentBanner = action.payload.data;
        }
      })

      // Reorder banners
      .addCase(reorderBanners.fulfilled, (state, action) => {
        action.payload.forEach(({ id, sortOrder }) => {
          const banner = state.banners.find(b => b.id === id);
          if (banner) {
            banner.sortOrder = sortOrder;
          }
        });
        state.banners.sort((a, b) => a.sortOrder - b.sortOrder);
      })

      // Bulk update banners
      .addCase(bulkUpdateBanners.fulfilled, (state, action) => {
        const { bannerIds, action: bulkAction } = action.payload;
        
        if (bulkAction === 'delete') {
          state.banners = state.banners.filter(banner => !bannerIds.includes(banner.id));
        } else {
          bannerIds.forEach(id => {
            const banner = state.banners.find(b => b.id === id);
            if (banner) {
              banner.isActive = bulkAction === 'activate';
            }
          });
        }
      })

      // Fetch banner stats
      .addCase(fetchBannerStats.fulfilled, (state, action) => {
        state.stats = action.payload.data;
      });
  }
});

export const { clearCurrentBanner, clearError } = bannerSlice.actions;
export default bannerSlice.reducer;
