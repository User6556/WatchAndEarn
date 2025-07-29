import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Fetch user profile
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/api/auth/profile');
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Token might be invalid, clear it
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Making API call to:', api.defaults.baseURL + '/api/auth/login');
      const response = await api.post('/api/auth/login', { email, password });
      console.log('API response:', response.data);
      const { token, user } = response.data;
      
      // Store token
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Set user
      setUser(user);
      
      return { success: true };
    } catch (error) {
      console.error('API error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      const message = error.response?.data?.error || 'Login failed';
      throw new Error(message);
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      const { token, user } = response.data;
      
      // Store token
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Set user
      setUser(user);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      
      // Clear all queries
      queryClient.clear();
      
      toast.success('Logged out successfully');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/api/auth/profile', profileData);
      setUser(response.data.user);
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update profile';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.put('/api/auth/change-password', {
        currentPassword,
        newPassword
      });
      toast.success('Password changed successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to change password';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const forgotPassword = async (email) => {
    try {
      await api.post('/api/auth/forgot-password', { email });
      toast.success('Password reset instructions sent to your email!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to send reset email';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const resetPassword = async (resetToken, newPassword) => {
    try {
      await api.post('/api/auth/reset-password', {
        resetToken,
        newPassword
      });
      toast.success('Password reset successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to reset password';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 