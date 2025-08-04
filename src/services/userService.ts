import api from './api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    orders: number;
    reviews: number;
  };
  addresses?: Address[];
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'USER' | 'ADMIN';
  isActive?: boolean;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: 'USER' | 'ADMIN';
  isActive?: boolean;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  newUsersThisMonth: number;
  verifiedUsers: number;
}

class UserService {
  // Get all users with pagination and filters
  async getAllUsers(filters: UserFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/admin/users?${params.toString()}`);
    return response.data;
  }

  // Get user by ID
  async getUserById(id: string) {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  }

  // Create new user
  async createUser(userData: CreateUserData) {
    const response = await api.post('/admin/users', userData);
    return response.data;
  }

  // Update user
  async updateUser(id: string, userData: UpdateUserData) {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  }

  // Delete user (deactivate)
  async deleteUser(id: string) {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  }

  // Reset user password
  async resetUserPassword(id: string, password: string) {
    const response = await api.post(`/admin/users/${id}/reset-password`, { password });
    return response.data;
  }

  // Toggle user status
  async toggleUserStatus(id: string) {
    const response = await api.patch(`/admin/users/${id}/toggle-status`);
    return response.data;
  }

  // Get user statistics
  async getUserStats(): Promise<{ success: boolean; data: UserStats }> {
    const response = await api.get('/admin/users/stats');
    return response.data;
  }
}

export const userService = new UserService();
export default userService;
