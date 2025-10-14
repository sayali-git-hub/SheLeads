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

// Product APIs
export const getAllProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProductById = async (productId) => {
  const response = await api.get(`/products/${productId}`);
  return response.data;
};

export const getFeaturedProducts = async () => {
  const response = await api.get('/products/featured');
  return response.data;
};

// Order APIs
export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get('/orders/my-orders');
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

// Cart APIs (if needed)
export const cartAddItem = async ({ productId, quantity }) => {
  const response = await api.post('/cart', { productId, quantity });
  return response.data;
};

export const cartGetByBuyer = async (buyerId) => {
  const response = await api.get(`/cart/${buyerId}`);
  return response.data;
};

export const cartGetMine = async () => {
  const response = await api.get('/cart/my');
  return response.data;
};

export const cartUpdateQuantity = async ({ cartItemId, quantity }) => {
  const response = await api.put(`/cart/${cartItemId}`, { quantity });
  return response.data;
};

export const cartRemoveItem = async (cartItemId) => {
  const response = await api.delete(`/cart/${cartItemId}`);
  return response.data;
};

export const getMyProfile = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateMyProfile = async (payload) => {
  const response = await api.put('/auth/profile', payload);
  return response.data;
};

export default api;
