import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../services/buyerApi';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'handmade', label: 'Handicrafts' },
    { value: 'food', label: 'Food Items' },
    { value: 'beauty', label: 'Beauty Products' },
    { value: 'home', label: 'Home Decor' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, searchQuery, sortBy, pagination.page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pagination.page,
        limit: 20
      };
      
      if (categoryFilter !== 'all') {
        params.category = categoryFilter;
      }
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      if (sortBy === 'price_asc') {
        params.sort = 'price_asc';
      } else if (sortBy === 'price_desc') {
        params.sort = 'price_desc';
      }
      
      const response = await getAllProducts(params);
      setProducts(response.data || []);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchProducts();
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600' };
    if (stock <= 5) return { text: `Only ${stock} left`, color: 'text-orange-600' };
    return { text: 'In Stock', color: 'text-green-600' };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Marketplace</h1>
      
      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700">Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPagination({ ...pagination, page: 1 });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="ml-auto text-gray-600">
            {pagination.total} products found
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => {
                setCategoryFilter(cat.value);
                setPagination({ ...pagination, page: 1 });
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                categoryFilter === cat.value
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-900">No products available</h3>
              <p className="mt-2 text-gray-500">Check back later for new products!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => {
                const stockStatus = getStockStatus(product.stock);
                const imageUrl = product.images && product.images.length > 0 
                  ? product.images[0].url 
                  : 'https://via.placeholder.com/300x400?text=No+Image';
                
                return (
                  <div key={product._id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white">
                    <Link to={`/products/${product._id}`}>
                      <div className="bg-gray-200 h-64 flex items-center justify-center overflow-hidden">
                        <img 
                          src={imageUrl}
                          alt={product.name} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-lg mb-1 line-clamp-2">{product.name}</h3>
                        <p className="text-2xl font-bold text-pink-600 mb-2">₹{product.price.toLocaleString('en-IN')}</p>
                        
                        {/* Category Badge */}
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full mb-2">
                          {product.category}
                        </span>
                        
                        {/* Seller Name */}
                        {product.seller && (
                          <p className="text-sm text-gray-500 mb-2">
                            Sold by: <span className="font-medium">{product.seller.name}</span>
                          </p>
                        )}
                        
                        {/* Stock Status */}
                        <p className={`text-sm font-medium ${stockStatus.color}`}>
                          {stockStatus.text}
                        </p>
                      </div>
                    </Link>
                    <div className="p-4 pt-0 space-y-2">
                      <Link 
                        to={`/products/${product._id}`}
                        className="block w-full bg-pink-600 text-white py-2 rounded-lg font-medium hover:bg-pink-700 transition-colors text-center"
                      >
                        View Details
                      </Link>
                      <button 
                        className="w-full bg-pink-100 text-pink-600 py-2 rounded-lg font-medium hover:bg-pink-200 transition-colors"
                        onClick={() => {
                          // Add to cart functionality
                          alert('Add to cart functionality coming soon!');
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
