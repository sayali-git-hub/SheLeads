import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Dashboard APIs
export const getDashboardStats = async () => {
  const response = await api.get('/seller/dashboard');
  return response.data;
};

// Profile APIs
export const getSellerProfile = async () => {
  const response = await api.get('/seller/profile');
  return response.data;
};

export const updateSellerProfile = async (profileData) => {
  const response = await api.put('/seller/profile', profileData);
  return response.data;
};

// Product APIs
export const getSellerProducts = async () => {
  const response = await api.get('/seller/products');
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post('/seller/products', productData);
  return response.data;
};

export const updateProduct = async (productId, productData) => {
  const response = await api.put(`/seller/products/${productId}`, productData);
  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await api.delete(`/seller/products/${productId}`);
  return response.data;
};

// Order APIs
export const getSellerOrders = async () => {
  const response = await api.get('/seller/orders');
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/seller/orders/${orderId}/status`, { status });
  return response.data;
};

// Notification APIs
export const getNotifications = async () => {
  const response = await api.get('/seller/notifications');
  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await api.put(`/seller/notifications/${notificationId}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await api.put('/seller/notifications/read-all');
  return response.data;
};

export const deleteNotification = async (notificationId) => {
  const response = await api.delete(`/seller/notifications/${notificationId}`);
  return response.data;
};

export const clearAllNotifications = async () => {
  const response = await api.delete('/seller/notifications');
  return response.data;
};

export default api;
