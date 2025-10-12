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
export const addToCart = async (productId, quantity) => {
  // Implement cart functionality if backend supports it
  // For now, we'll handle cart in frontend localStorage
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existingItem = cart.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  return { success: true, cart };
};

export const getCart = () => {
  return JSON.parse(localStorage.getItem('cart') || '[]');
};

export const removeFromCart = (productId) => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const updatedCart = cart.filter(item => item.productId !== productId);
  localStorage.setItem('cart', JSON.stringify(updatedCart));
  return { success: true, cart: updatedCart };
};

export const clearCart = () => {
  localStorage.removeItem('cart');
  return { success: true };
};

export default api;
