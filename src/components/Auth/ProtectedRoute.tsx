import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { RootState } from '../../store';
import { loginSuccess } from '../../store/slices/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, token, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check if user has valid token in localStorage
    if (token && !isAuthenticated) {
      // Simulate token validation - replace with actual API call
      const mockUser = {
        id: '1',
        email: 'admin@fashion.com',
        name: 'Admin User',
        role: 'admin',
        permissions: ['all'],
      };
      
      dispatch(loginSuccess({ user: mockUser, token }));
    }
  }, [token, isAuthenticated, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;