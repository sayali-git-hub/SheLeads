import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Check if user is logged in
  if (!token) {
    toast.error('Please login to access this page');
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required role
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    toast.error(`Access denied. This page is for ${allowedRoles.join(' or ')} only.`);
    
    // Redirect based on user's actual role
    if (userRole === 'seller') {
      return <Navigate to="/seller/dashboard" replace />;
    } else if (userRole === 'buyer') {
      return <Navigate to="/" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
