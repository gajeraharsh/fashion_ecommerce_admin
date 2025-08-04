import api from './api';

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export interface CreateAuditLogData {
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditFilters {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
  resource?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface AuditStats {
  totalLogs: number;
  todayLogs: number;
  weekLogs: number;
  monthLogs: number;
  actionBreakdown: Array<{
    action: string;
    _count: number;
  }>;
  resourceBreakdown: Array<{
    resource: string;
    _count: number;
  }>;
  mostActiveUsers: Array<{
    userId: string;
    _count: number;
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  }>;
}

class AuditService {
  // Get all audit logs with filters
  async getAllAuditLogs(filters: AuditFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/admin/audit-logs?${params.toString()}`);
    return response.data;
  }

  // Get single audit log by ID
  async getAuditLogById(id: string) {
    const response = await api.get(`/admin/audit-logs/${id}`);
    return response.data;
  }

  // Create new audit log (internal use)
  async createAuditLog(data: CreateAuditLogData) {
    const response = await api.post('/admin/audit-logs', data);
    return response.data;
  }

  // Delete audit log
  async deleteAuditLog(id: string) {
    const response = await api.delete(`/admin/audit-logs/${id}`);
    return response.data;
  }

  // Bulk delete audit logs (cleanup)
  async bulkDeleteAuditLogs(olderThan: string) {
    const response = await api.delete('/admin/audit-logs/bulk/cleanup', {
      data: { olderThan }
    });
    return response.data;
  }

  // Get audit statistics
  async getAuditStats(): Promise<{ data: AuditStats }> {
    const response = await api.get('/admin/audit-logs/stats');
    return response.data;
  }

  // Export audit logs
  async exportAuditLogs(filters: Omit<AuditFilters, 'page' | 'limit'> = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/admin/audit-logs/export?${params.toString()}`, {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'audit-logs.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true, message: 'Export completed' };
  }

  // Get resource timeline
  async getResourceTimeline(resource: string, resourceId: string) {
    const response = await api.get(`/admin/audit-logs/resource/${resource}/${resourceId}`);
    return response.data;
  }
}

export default new AuditService();
