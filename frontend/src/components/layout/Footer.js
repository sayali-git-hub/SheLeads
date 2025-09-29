import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">SheLead</h3>
            <p className="text-gray-400">Empowering women through fashion and entrepreneurship.</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white"><FaFacebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FaTwitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FaInstagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FaLinkedin size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-400 hover:text-white">All Products</Link></li>
              <li><Link to="/categories/dresses" className="text-gray-400 hover:text-white">Dresses</Link></li>
              <li><Link to="/categories/tops" className="text-gray-400 hover:text-white">Tops</Link></li>
              <li><Link to="/categories/bottoms" className="text-gray-400 hover:text-white">Bottoms</Link></li>
              <li><Link to="/categories/accessories" className="text-gray-400 hover:text-white">Accessories</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQs</Link></li>
              <li><Link to="/shipping" className="text-gray-400 hover:text-white">Shipping & Returns</Link></li>
              <li><Link to="/size-guide" className="text-gray-400 hover:text-white">Size Guide</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">Subscribe to get updates on new arrivals and special offers.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-2 w-full rounded-l-lg text-gray-900 focus:outline-none"
              />
              <button className="bg-pink-600 text-white px-4 py-2 rounded-r-lg hover:bg-pink-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SheLead. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
