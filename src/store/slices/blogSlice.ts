import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import blogService, { BlogPost, CreateBlogData, UpdateBlogData, BlogFilters, BlogStats } from '../../services/blogService';

interface BlogState {
  blogs: BlogPost[];
  currentBlog: BlogPost | null;
  stats: BlogStats | null;
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

const initialState: BlogState = {
  blogs: [],
  currentBlog: null,
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
export const fetchBlogs = createAsyncThunk(
  'blog/fetchBlogs',
  async (filters: BlogFilters = {}) => {
    const response = await blogService.getAllBlogs(filters);
    return response;
  }
);

export const fetchBlogById = createAsyncThunk(
  'blog/fetchBlogById',
  async (id: string) => {
    const response = await blogService.getBlogById(id);
    return response;
  }
);

export const createBlog = createAsyncThunk(
  'blog/createBlog',
  async (data: CreateBlogData) => {
    const response = await blogService.createBlog(data);
    return response;
  }
);

export const updateBlog = createAsyncThunk(
  'blog/updateBlog',
  async ({ id, data }: { id: string; data: UpdateBlogData }) => {
    const response = await blogService.updateBlog(id, data);
    return response;
  }
);

export const deleteBlog = createAsyncThunk(
  'blog/deleteBlog',
  async (id: string) => {
    await blogService.deleteBlog(id);
    return id;
  }
);

export const toggleBlogStatus = createAsyncThunk(
  'blog/toggleBlogStatus',
  async (id: string) => {
    const response = await blogService.toggleBlogStatus(id);
    return response;
  }
);

export const bulkUpdateBlogs = createAsyncThunk(
  'blog/bulkUpdateBlogs',
  async ({ blogIds, action }: { blogIds: string[]; action: 'publish' | 'unpublish' | 'delete' }) => {
    const response = await blogService.bulkUpdateBlogs(blogIds, action);
    return { response, blogIds, action };
  }
);

export const fetchBlogStats = createAsyncThunk(
  'blog/fetchBlogStats',
  async () => {
    const response = await blogService.getBlogStats();
    return response;
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.data.blogs;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch blogs';
      })

      // Fetch blog by ID
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBlog = action.payload.data;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch blog';
      })

      // Create blog
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs.unshift(action.payload.data);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create blog';
      })

      // Update blog
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.blogs.findIndex(blog => blog.id === action.payload.data.id);
        if (index !== -1) {
          state.blogs[index] = action.payload.data;
        }
        if (state.currentBlog?.id === action.payload.data.id) {
          state.currentBlog = action.payload.data;
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update blog';
      })

      // Delete blog
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = state.blogs.filter(blog => blog.id !== action.payload);
        if (state.currentBlog?.id === action.payload) {
          state.currentBlog = null;
        }
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete blog';
      })

      // Toggle blog status
      .addCase(toggleBlogStatus.fulfilled, (state, action) => {
        const index = state.blogs.findIndex(blog => blog.id === action.payload.data.id);
        if (index !== -1) {
          state.blogs[index] = action.payload.data;
        }
        if (state.currentBlog?.id === action.payload.data.id) {
          state.currentBlog = action.payload.data;
        }
      })

      // Bulk update blogs
      .addCase(bulkUpdateBlogs.fulfilled, (state, action) => {
        const { blogIds, action: bulkAction } = action.payload;
        
        if (bulkAction === 'delete') {
          state.blogs = state.blogs.filter(blog => !blogIds.includes(blog.id));
        } else {
          blogIds.forEach(id => {
            const blog = state.blogs.find(b => b.id === id);
            if (blog) {
              blog.isPublished = bulkAction === 'publish';
              if (bulkAction === 'publish' && !blog.publishedAt) {
                blog.publishedAt = new Date().toISOString();
              }
            }
          });
        }
      })

      // Fetch blog stats
      .addCase(fetchBlogStats.fulfilled, (state, action) => {
        state.stats = action.payload.data;
      });
  }
});

export const { clearCurrentBlog, clearError } = blogSlice.actions;
export default blogSlice.reducer;
