import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log the base URL for debugging
console.log('API Base URL:', api.defaults.baseURL);

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      fullURL: config.baseURL + config.url
    });
    
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  logout: () => api.post('/api/auth/logout'),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (profileData) => api.put('/api/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/api/auth/change-password', passwordData),
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (resetData) => api.post('/api/auth/reset-password', resetData),
};

export const videosAPI = {
  getAll: (params) => api.get('/api/videos', { params }),
  getFeatured: () => api.get('/api/videos/featured'),
  getById: (id) => api.get(`/api/videos/${id}`),
  watch: (id, watchData) => api.post(`/api/videos/${id}/watch`, watchData),
  getWatchHistory: (params) => api.get('/api/videos/history/watched', { params }),
  getCategories: () => api.get('/api/videos/categories/list'),
  getTrending: () => api.get('/api/videos/trending/list'),
};

export const rewardsAPI = {
  getStats: () => api.get('/api/rewards/stats'),
  getHistory: (params) => api.get('/api/rewards/history', { params }),
  withdraw: (withdrawalData) => api.post('/api/rewards/withdraw', withdrawalData),
  getWithdrawals: (params) => api.get('/api/rewards/withdrawals', { params }),
  getWithdrawalMethods: () => api.get('/api/rewards/withdrawal-methods'),
  getReferrals: () => api.get('/api/rewards/referrals'),
  getDailyChart: (params) => api.get('/api/rewards/chart/daily', { params }),
};

export const usersAPI = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (profileData) => api.put('/api/users/profile', profileData),
  getStats: () => api.get('/api/users/stats'),
  getWatchHistory: (params) => api.get('/api/users/watch-history', { params }),
  getReferrals: () => api.get('/api/users/referrals'),
  deactivateAccount: (password) => api.post('/api/users/deactivate', { password }),
  deleteAccount: (password) => api.delete('/api/users/delete', { data: { password } }),
  getAchievements: () => api.get('/api/users/achievements'),
};

export default api; 