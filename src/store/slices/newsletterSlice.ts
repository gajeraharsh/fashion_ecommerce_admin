import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import newsletterService, { Newsletter, CreateNewsletterData, UpdateNewsletterData, NewsletterFilters, NewsletterStats } from '../../services/newsletterService';

interface NewsletterState {
  subscribers: Newsletter[];
  currentSubscriber: Newsletter | null;
  stats: NewsletterStats | null;
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

const initialState: NewsletterState = {
  subscribers: [],
  currentSubscriber: null,
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
export const fetchSubscribers = createAsyncThunk(
  'newsletter/fetchSubscribers',
  async (filters: NewsletterFilters = {}) => {
    const response = await newsletterService.getAllSubscribers(filters);
    return response;
  }
);

export const fetchSubscriberById = createAsyncThunk(
  'newsletter/fetchSubscriberById',
  async (id: string) => {
    const response = await newsletterService.getSubscriberById(id);
    return response;
  }
);

export const createSubscriber = createAsyncThunk(
  'newsletter/createSubscriber',
  async (data: CreateNewsletterData) => {
    const response = await newsletterService.createSubscriber(data);
    return response;
  }
);

export const updateSubscriber = createAsyncThunk(
  'newsletter/updateSubscriber',
  async ({ id, data }: { id: string; data: UpdateNewsletterData }) => {
    const response = await newsletterService.updateSubscriber(id, data);
    return response;
  }
);

export const deleteSubscriber = createAsyncThunk(
  'newsletter/deleteSubscriber',
  async (id: string) => {
    await newsletterService.deleteSubscriber(id);
    return id;
  }
);

export const toggleSubscriberStatus = createAsyncThunk(
  'newsletter/toggleSubscriberStatus',
  async (id: string) => {
    const response = await newsletterService.toggleSubscriberStatus(id);
    return response;
  }
);

export const bulkUpdateSubscribers = createAsyncThunk(
  'newsletter/bulkUpdateSubscribers',
  async ({ subscriberIds, action }: { subscriberIds: string[]; action: 'subscribe' | 'unsubscribe' | 'delete' }) => {
    const response = await newsletterService.bulkUpdateSubscribers(subscriberIds, action);
    return { response, subscriberIds, action };
  }
);

export const fetchNewsletterStats = createAsyncThunk(
  'newsletter/fetchNewsletterStats',
  async () => {
    const response = await newsletterService.getNewsletterStats();
    return response;
  }
);

export const exportSubscribers = createAsyncThunk(
  'newsletter/exportSubscribers',
  async (isActive?: boolean) => {
    const response = await newsletterService.exportSubscribers(isActive);
    return response;
  }
);

const newsletterSlice = createSlice({
  name: 'newsletter',
  initialState,
  reducers: {
    clearCurrentSubscriber: (state) => {
      state.currentSubscriber = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch subscribers
      .addCase(fetchSubscribers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscribers.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribers = action.payload.data.subscribers;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchSubscribers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch subscribers';
      })

      // Fetch subscriber by ID
      .addCase(fetchSubscriberById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriberById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubscriber = action.payload.data;
      })
      .addCase(fetchSubscriberById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch subscriber';
      })

      // Create subscriber
      .addCase(createSubscriber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubscriber.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribers.unshift(action.payload.data);
      })
      .addCase(createSubscriber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create subscriber';
      })

      // Update subscriber
      .addCase(updateSubscriber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubscriber.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.subscribers.findIndex(sub => sub.id === action.payload.data.id);
        if (index !== -1) {
          state.subscribers[index] = action.payload.data;
        }
        if (state.currentSubscriber?.id === action.payload.data.id) {
          state.currentSubscriber = action.payload.data;
        }
      })
      .addCase(updateSubscriber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update subscriber';
      })

      // Delete subscriber
      .addCase(deleteSubscriber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubscriber.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribers = state.subscribers.filter(sub => sub.id !== action.payload);
        if (state.currentSubscriber?.id === action.payload) {
          state.currentSubscriber = null;
        }
      })
      .addCase(deleteSubscriber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete subscriber';
      })

      // Toggle subscriber status
      .addCase(toggleSubscriberStatus.fulfilled, (state, action) => {
        const index = state.subscribers.findIndex(sub => sub.id === action.payload.data.id);
        if (index !== -1) {
          state.subscribers[index] = action.payload.data;
        }
        if (state.currentSubscriber?.id === action.payload.data.id) {
          state.currentSubscriber = action.payload.data;
        }
      })

      // Bulk update subscribers
      .addCase(bulkUpdateSubscribers.fulfilled, (state, action) => {
        const { subscriberIds, action: bulkAction } = action.payload;
        
        if (bulkAction === 'delete') {
          state.subscribers = state.subscribers.filter(sub => !subscriberIds.includes(sub.id));
        } else {
          subscriberIds.forEach(id => {
            const subscriber = state.subscribers.find(sub => sub.id === id);
            if (subscriber) {
              subscriber.isActive = bulkAction === 'subscribe';
              if (bulkAction === 'unsubscribe') {
                subscriber.unsubscribedAt = new Date().toISOString();
              } else {
                subscriber.unsubscribedAt = undefined;
              }
            }
          });
        }
      })

      // Fetch newsletter stats
      .addCase(fetchNewsletterStats.fulfilled, (state, action) => {
        state.stats = action.payload.data;
      });
  }
});

export const { clearCurrentSubscriber, clearError } = newsletterSlice.actions;
export default newsletterSlice.reducer;
