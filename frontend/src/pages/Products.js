import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Products = () => {
  const [products] = useState([
    { id: 1, name: 'Floral Summer Dress', price: 59.99, image: 'https://via.placeholder.com/300x400', category: 'Dresses' },
    { id: 2, name: 'Classic White Blouse', price: 39.99, image: 'https://via.placeholder.com/300x400', category: 'Tops' },
    { id: 3, name: 'High-Waisted Jeans', price: 69.99, image: 'https://via.placeholder.com/300x400', category: 'Bottoms' },
    { id: 4, name: 'Leather Tote Bag', price: 89.99, image: 'https://via.placeholder.com/300x400', category: 'Accessories' },
    { id: 5, name: 'Silk Scarf', price: 29.99, image: 'https://via.placeholder.com/300x400', category: 'Accessories' },
    { id: 6, name: 'Knit Sweater', price: 49.99, image: 'https://via.placeholder.com/300x400', category: 'Tops' },
  ]);

  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredProducts = categoryFilter === 'all' 
    ? products 
    : products.filter(product => product.category === categoryFilter);

  const categories = ['all', ...new Set(products.map(product => product.category))];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                categoryFilter === category
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <Link to={`/products/${product.id}`}>
                <div className="bg-gray-200 h-64 flex items-center justify-center">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                  <p className="text-gray-600">${product.price.toFixed(2)}</p>
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full mt-2">
                    {product.category}
                  </span>
                </div>
              </Link>
              <div className="p-4 pt-0">
                <button className="w-full bg-pink-100 text-pink-600 py-2 rounded-lg font-medium hover:bg-pink-200 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
