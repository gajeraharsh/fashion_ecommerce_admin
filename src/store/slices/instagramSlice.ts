import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import instagramService, { InstagramPost, CreateInstagramPostData, UpdateInstagramPostData, InstagramFilters, InstagramStats } from '../../services/instagramService';

interface InstagramState {
  instagramPosts: InstagramPost[];
  currentInstagramPost: InstagramPost | null;
  stats: InstagramStats | null;
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

const initialState: InstagramState = {
  instagramPosts: [],
  currentInstagramPost: null,
  stats: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  }
};

// Async thunks
export const fetchInstagramPosts = createAsyncThunk(
  'instagram/fetchInstagramPosts',
  async (filters: InstagramFilters = {}) => {
    const response = await instagramService.getAllInstagramPosts(filters);
    return response;
  }
);

export const fetchInstagramPostById = createAsyncThunk(
  'instagram/fetchInstagramPostById',
  async (id: string) => {
    const response = await instagramService.getInstagramPostById(id);
    return response;
  }
);

export const createInstagramPost = createAsyncThunk(
  'instagram/createInstagramPost',
  async (data: CreateInstagramPostData) => {
    const response = await instagramService.createInstagramPost(data);
    return response;
  }
);

export const updateInstagramPost = createAsyncThunk(
  'instagram/updateInstagramPost',
  async ({ id, data }: { id: string; data: UpdateInstagramPostData }) => {
    const response = await instagramService.updateInstagramPost(id, data);
    return response;
  }
);

export const deleteInstagramPost = createAsyncThunk(
  'instagram/deleteInstagramPost',
  async (id: string) => {
    await instagramService.deleteInstagramPost(id);
    return id;
  }
);

export const toggleInstagramPostStatus = createAsyncThunk(
  'instagram/toggleInstagramPostStatus',
  async (id: string) => {
    const response = await instagramService.toggleInstagramPostStatus(id);
    return response;
  }
);

export const reorderInstagramPosts = createAsyncThunk(
  'instagram/reorderInstagramPosts',
  async (postOrders: Array<{ id: string; sortOrder: number }>) => {
    await instagramService.reorderInstagramPosts(postOrders);
    return postOrders;
  }
);

export const bulkUpdateInstagramPosts = createAsyncThunk(
  'instagram/bulkUpdateInstagramPosts',
  async ({ postIds, action }: { postIds: string[]; action: 'activate' | 'deactivate' | 'delete' }) => {
    const response = await instagramService.bulkUpdateInstagramPosts(postIds, action);
    return { response, postIds, action };
  }
);

export const fetchInstagramStats = createAsyncThunk(
  'instagram/fetchInstagramStats',
  async () => {
    const response = await instagramService.getInstagramStats();
    return response;
  }
);

export const syncWithInstagram = createAsyncThunk(
  'instagram/syncWithInstagram',
  async () => {
    const response = await instagramService.syncWithInstagram();
    return response;
  }
);

const instagramSlice = createSlice({
  name: 'instagram',
  initialState,
  reducers: {
    clearCurrentInstagramPost: (state) => {
      state.currentInstagramPost = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Instagram posts
      .addCase(fetchInstagramPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstagramPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.instagramPosts = action.payload.data.instagramPosts;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchInstagramPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch Instagram posts';
      })

      // Fetch Instagram post by ID
      .addCase(fetchInstagramPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstagramPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInstagramPost = action.payload.data;
      })
      .addCase(fetchInstagramPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch Instagram post';
      })

      // Create Instagram post
      .addCase(createInstagramPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInstagramPost.fulfilled, (state, action) => {
        state.loading = false;
        state.instagramPosts.unshift(action.payload.data);
      })
      .addCase(createInstagramPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create Instagram post';
      })

      // Update Instagram post
      .addCase(updateInstagramPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInstagramPost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.instagramPosts.findIndex(post => post.id === action.payload.data.id);
        if (index !== -1) {
          state.instagramPosts[index] = action.payload.data;
        }
        if (state.currentInstagramPost?.id === action.payload.data.id) {
          state.currentInstagramPost = action.payload.data;
        }
      })
      .addCase(updateInstagramPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update Instagram post';
      })

      // Delete Instagram post
      .addCase(deleteInstagramPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInstagramPost.fulfilled, (state, action) => {
        state.loading = false;
        state.instagramPosts = state.instagramPosts.filter(post => post.id !== action.payload);
        if (state.currentInstagramPost?.id === action.payload) {
          state.currentInstagramPost = null;
        }
      })
      .addCase(deleteInstagramPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete Instagram post';
      })

      // Toggle Instagram post status
      .addCase(toggleInstagramPostStatus.fulfilled, (state, action) => {
        const index = state.instagramPosts.findIndex(post => post.id === action.payload.data.id);
        if (index !== -1) {
          state.instagramPosts[index] = action.payload.data;
        }
        if (state.currentInstagramPost?.id === action.payload.data.id) {
          state.currentInstagramPost = action.payload.data;
        }
      })

      // Reorder Instagram posts
      .addCase(reorderInstagramPosts.fulfilled, (state, action) => {
        action.payload.forEach(({ id, sortOrder }) => {
          const post = state.instagramPosts.find(p => p.id === id);
          if (post) {
            post.sortOrder = sortOrder;
          }
        });
        state.instagramPosts.sort((a, b) => a.sortOrder - b.sortOrder);
      })

      // Bulk update Instagram posts
      .addCase(bulkUpdateInstagramPosts.fulfilled, (state, action) => {
        const { postIds, action: bulkAction } = action.payload;
        
        if (bulkAction === 'delete') {
          state.instagramPosts = state.instagramPosts.filter(post => !postIds.includes(post.id));
        } else {
          postIds.forEach(id => {
            const post = state.instagramPosts.find(p => p.id === id);
            if (post) {
              post.isActive = bulkAction === 'activate';
            }
          });
        }
      })

      // Fetch Instagram stats
      .addCase(fetchInstagramStats.fulfilled, (state, action) => {
        state.stats = action.payload.data;
      })

      // Sync with Instagram
      .addCase(syncWithInstagram.fulfilled, (state, action) => {
        // Handle sync response - could refresh posts if new ones were added
      });
  }
});

export const { clearCurrentInstagramPost, clearError } = instagramSlice.actions;
export default instagramSlice.reducer;
