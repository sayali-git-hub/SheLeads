import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = false; // Will be replaced with actual auth state

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-pink-600">
            SheLead
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-pink-600">Home</Link>
            <Link to="/products" className="text-gray-700 hover:text-pink-600">Shop</Link>
            <Link to="/profile" className="text-gray-700 hover:text-pink-600">Profile</Link>
            {location.pathname !== '/' && (
              <Link to="/about" className="text-gray-700 hover:text-pink-600">About</Link>
            )}
            <Link to="/contact" className="text-gray-700 hover:text-pink-600">Contact</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/cart')} 
              className="relative p-2 text-gray-700 hover:text-pink-600"
            >
              <FaShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </button>
            
            {isAuthenticated ? (
              <div className="relative group">
                <button className="p-2 text-gray-700 hover:text-pink-600">
                  <FaUser size={20} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">My Orders</Link>
                  <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-pink-600">Login</Link>
                <Link 
                  to="/register" 
                  className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
