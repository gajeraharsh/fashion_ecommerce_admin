import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'blocked';
  role: 'customer' | 'admin' | 'staff';
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

interface UserState {
  users: User[];
  loading: boolean;
  totalCount: number;
}

const initialState: UserState = {
  users: [],
  loading: false,
  totalCount: 0,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    updateUserStatus: (state, action: PayloadAction<{ userId: string; status: User['status'] }>) => {
      const user = state.users.find(u => u.id === action.payload.userId);
      if (user) {
        user.status = action.payload.status;
      }
    },
  },
});

export const { setUsers, setLoading, updateUserStatus } = userSlice.actions;
export default userSlice.reducer;