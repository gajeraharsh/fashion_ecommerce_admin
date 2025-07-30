import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'customer' | 'vendor';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  emailVerified: boolean;
  phoneVerified: boolean;
  totalOrders: number;
  totalSpent: number;
  lastLogin: string;
  createdAt: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    newsletter: boolean;
    sms: boolean;
    orderUpdates: boolean;
  };
  loyaltyPoints: number;
  birthday?: string;
  gender?: 'male' | 'female' | 'other';
}

interface UserState {
  users: User[];
  loading: boolean;
  totalCount: number;
  roles: string[];
  permissions: Record<string, string[]>;
}

const initialState: UserState = {
  users: [],
  loading: false,
  totalCount: 0,
  roles: ['admin', 'manager', 'customer', 'vendor'],
  permissions: {
    admin: ['read', 'write', 'delete', 'manage_users', 'manage_products', 'manage_orders', 'manage_settings'],
    manager: ['read', 'write', 'manage_products', 'manage_orders'],
    customer: ['read'],
    vendor: ['read', 'write_own_products', 'manage_own_orders'],
  },
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
      state.totalCount = action.payload.length;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.unshift(action.payload);
      state.totalCount += 1;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(u => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(u => u.id !== action.payload);
      state.totalCount -= 1;
    },
    updateUserStatus: (state, action: PayloadAction<{ userId: string; status: User['status'] }>) => {
      const user = state.users.find(u => u.id === action.payload.userId);
      if (user) {
        user.status = action.payload.status;
      }
    },
    updateUserRole: (state, action: PayloadAction<{ userId: string; role: User['role'] }>) => {
      const user = state.users.find(u => u.id === action.payload.userId);
      if (user) {
        user.role = action.payload.role;
      }
    },
    verifyUserEmail: (state, action: PayloadAction<string>) => {
      const user = state.users.find(u => u.id === action.payload);
      if (user) {
        user.emailVerified = true;
      }
    },
    verifyUserPhone: (state, action: PayloadAction<string>) => {
      const user = state.users.find(u => u.id === action.payload);
      if (user) {
        user.phoneVerified = true;
      }
    },
  },
});

export const {
  setUsers,
  setLoading,
  addUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  updateUserRole,
  verifyUserEmail,
  verifyUserPhone,
} = userSlice.actions;

export default userSlice.reducer;
