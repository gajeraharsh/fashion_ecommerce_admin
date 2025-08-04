import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import auditService, { AuditLog, CreateAuditLogData, AuditFilters, AuditStats } from '../../services/auditService';

interface AuditState {
  auditLogs: AuditLog[];
  currentAuditLog: AuditLog | null;
  resourceTimeline: AuditLog[];
  stats: AuditStats | null;
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

const initialState: AuditState = {
  auditLogs: [],
  currentAuditLog: null,
  resourceTimeline: [],
  stats: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  }
};

// Async thunks
export const fetchAuditLogs = createAsyncThunk(
  'audit/fetchAuditLogs',
  async (filters: AuditFilters = {}) => {
    const response = await auditService.getAllAuditLogs(filters);
    return response;
  }
);

export const fetchAuditLogById = createAsyncThunk(
  'audit/fetchAuditLogById',
  async (id: string) => {
    const response = await auditService.getAuditLogById(id);
    return response;
  }
);

export const createAuditLog = createAsyncThunk(
  'audit/createAuditLog',
  async (data: CreateAuditLogData) => {
    const response = await auditService.createAuditLog(data);
    return response;
  }
);

export const deleteAuditLog = createAsyncThunk(
  'audit/deleteAuditLog',
  async (id: string) => {
    await auditService.deleteAuditLog(id);
    return id;
  }
);

export const bulkDeleteAuditLogs = createAsyncThunk(
  'audit/bulkDeleteAuditLogs',
  async (olderThan: string) => {
    const response = await auditService.bulkDeleteAuditLogs(olderThan);
    return response;
  }
);

export const fetchAuditStats = createAsyncThunk(
  'audit/fetchAuditStats',
  async () => {
    const response = await auditService.getAuditStats();
    return response;
  }
);

export const exportAuditLogs = createAsyncThunk(
  'audit/exportAuditLogs',
  async (filters: Omit<AuditFilters, 'page' | 'limit'> = {}) => {
    const response = await auditService.exportAuditLogs(filters);
    return response;
  }
);

export const fetchResourceTimeline = createAsyncThunk(
  'audit/fetchResourceTimeline',
  async ({ resource, resourceId }: { resource: string; resourceId: string }) => {
    const response = await auditService.getResourceTimeline(resource, resourceId);
    return response;
  }
);

const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    clearCurrentAuditLog: (state) => {
      state.currentAuditLog = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearResourceTimeline: (state) => {
      state.resourceTimeline = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch audit logs
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.auditLogs = action.payload.data.auditLogs;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch audit logs';
      })

      // Fetch audit log by ID
      .addCase(fetchAuditLogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAuditLog = action.payload.data;
      })
      .addCase(fetchAuditLogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch audit log';
      })

      // Create audit log
      .addCase(createAuditLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAuditLog.fulfilled, (state, action) => {
        state.loading = false;
        state.auditLogs.unshift(action.payload.data);
      })
      .addCase(createAuditLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create audit log';
      })

      // Delete audit log
      .addCase(deleteAuditLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAuditLog.fulfilled, (state, action) => {
        state.loading = false;
        state.auditLogs = state.auditLogs.filter(log => log.id !== action.payload);
        if (state.currentAuditLog?.id === action.payload) {
          state.currentAuditLog = null;
        }
      })
      .addCase(deleteAuditLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete audit log';
      })

      // Bulk delete audit logs
      .addCase(bulkDeleteAuditLogs.fulfilled, (state, action) => {
        // Refresh the audit logs after bulk delete
        // The actual removal will be handled by the next fetchAuditLogs call
      })

      // Fetch audit stats
      .addCase(fetchAuditStats.fulfilled, (state, action) => {
        state.stats = action.payload.data;
      })

      // Fetch resource timeline
      .addCase(fetchResourceTimeline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResourceTimeline.fulfilled, (state, action) => {
        state.loading = false;
        state.resourceTimeline = action.payload.data;
      })
      .addCase(fetchResourceTimeline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch resource timeline';
      });
  }
});

export const { clearCurrentAuditLog, clearError, clearResourceTimeline } = auditSlice.actions;
export default auditSlice.reducer;
