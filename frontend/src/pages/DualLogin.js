import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export default function DualLogin() {
  const [loginType, setLoginType] = useState('buyer'); // 'buyer' or 'seller'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData);
      
      if (response.data.success) {
        const { token, role, name, businessName } = response.data.data;
        
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', role);
        localStorage.setItem('userName', name);
        if (businessName) {
          localStorage.setItem('businessName', businessName);
        }
        
        toast.success(`Welcome back, ${businessName || name}!`);
        
        // Redirect based on role
        if (role === 'seller') {
          navigate('/seller/dashboard');
        } else if (role === 'buyer') {
          navigate('/');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Invalid email or password';
      toast.error(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        {/* Header */}
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Welcome to SheLeads
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to continue
          </p>
        </div>

        {/* Login Type Toggle */}
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setLoginType('buyer')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              loginType === 'buyer'
                ? 'bg-white text-pink-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Login as Buyer
          </button>
          <button
            type="button"
            onClick={() => setLoginType('seller')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              loginType === 'seller'
                ? 'bg-white text-pink-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Login as Seller
          </button>
        </div>

        {/* Info Message */}
        <div className={`p-4 rounded-lg ${loginType === 'seller' ? 'bg-purple-50 border border-purple-200' : 'bg-pink-50 border border-pink-200'}`}>
          <p className="text-sm text-gray-700">
            {loginType === 'seller' ? (
              <>
                <span className="font-semibold">Sellers:</span> Access your dashboard to manage products, orders, and view analytics.
              </>
            ) : (
              <>
                <span className="font-semibold">Buyers:</span> Browse products, place orders, and track your purchases.
              </>
            )}
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent sm:text-sm"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent sm:text-sm"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <button 
                type="button" 
                className="font-medium text-pink-600 hover:text-pink-500"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                loginType === 'seller' 
                  ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500' 
                  : 'bg-pink-600 hover:bg-pink-700 focus:ring-pink-500'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                `Sign in as ${loginType === 'seller' ? 'Seller' : 'Buyer'}`
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-medium text-pink-600 hover:text-pink-500"
              >
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
