import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Prevent duplicate toasts when multiple guards render quickly
let lastToastAt = 0;
const showToastOnce = (message) => {
  const now = Date.now();
  if (now - lastToastAt > 1500) {
    lastToastAt = now;
    toast.error(message);
  }
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Check if user is logged in
  if (!token) {
    showToastOnce('Please login to access this page');
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required role
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    showToastOnce(`Access denied. This page is for ${allowedRoles.join(' or ')} only.`);
    // Redirect based on user's actual role
    if (userRole === 'seller') {
      return <Navigate to="/seller/dashboard" replace />;
    }
    if (userRole === 'buyer') {
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
