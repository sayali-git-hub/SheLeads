import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Welcome to SheLead</h1>
        <p className="text-xl mb-8">Empowering women through fashion</p>
        <Link 
          to="/products" 
          className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
        >
          Shop Now
        </Link>
      </section>

      <section className="my-16">
        <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Product cards will be mapped here */}
          <div className="border rounded-lg p-4">
            <div className="bg-gray-200 h-48 mb-4"></div>
            <h3 className="font-medium">Product Name</h3>
            <p className="text-gray-600">$99.99</p>
          </div>
          {/* Add more product cards */}
        </div>
      </section>
    </div>
  );
};

export default Home;
