import axios from 'axios';

// Get base URL for API calls
const getBaseURL = () => {
  // In production, use relative paths to work with CloudFront domain
  if (process.env.NODE_ENV === 'production') {
    // Use relative path for production - this will automatically use the current domain
    return '';
  }
  
  // In development, use the environment variable or default to localhost
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  return apiUrl;
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  // Ensure credentials are sent with requests
  withCredentials: true,
});

// Log the base URL for debugging (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('API Base URL:', api.defaults.baseURL);
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        method: config.method,
        url: config.url,
        baseURL: config.baseURL,
        fullURL: config.baseURL + config.url
      });
    }
    
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
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data
      });
    }
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
};

export const videosAPI = {
  getAll: (params) => api.get('/api/videos', { params }),
};

export const rewardsAPI = {
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