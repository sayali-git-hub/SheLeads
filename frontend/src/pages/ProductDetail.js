import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProductById } from '../services/buyerApi';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProductById(id);
      setProduct(response.data);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    alert(`Added ${quantity} item(s) to cart!`);
  };

  const handlePlaceOrder = () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to proceed with checkout');
      navigate('/login');
      return;
    }

    // Navigate to checkout with product and quantity
    navigate('/checkout', { 
      state: { 
        cartItems: [{ 
          product: product._id, 
          quantity,
          price: product.price,
          name: product.name,
          image: product.images?.[0]?.url
        }] 
      } 
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error || 'Product not found'}
        </div>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [{ url: 'https://via.placeholder.com/600x600?text=No+Image', altText: 'No image' }];

  const stockStatus = product.stock === 0 
    ? { text: 'Out of Stock', color: 'text-red-600', available: false }
    : product.stock <= 5 
    ? { text: `Only ${product.stock} left`, color: 'text-orange-600', available: true }
    : { text: 'In Stock', color: 'text-green-600', available: true };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <button onClick={() => navigate('/products')} className="text-pink-600 hover:underline">
          Products
        </button>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-700">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <div>
          {/* Main Image */}
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img
              src={images[selectedImage].url}
              alt={images[selectedImage].altText || product.name}
              className="w-full h-96 lg:h-[500px] object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
              }}
            />
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'border-pink-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.altText || `${product.name} ${index + 1}`}
                    className="w-full h-20 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Product Details */}
        <div>
          {/* Product Name */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

          {/* Price */}
          <div className="mb-4">
            <span className="text-4xl font-bold text-pink-600">₹{product.price.toLocaleString('en-IN')}</span>
          </div>

          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
              {product.category}
            </span>
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            <p className={`text-lg font-semibold ${stockStatus.color}`}>
              {stockStatus.text}
            </p>
          </div>

          {/* Seller Information */}
          {product.seller && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Sold by</p>
              <p className="text-lg font-semibold text-gray-900">{product.seller.name}</p>
              {product.seller.email && (
                <p className="text-sm text-gray-600">{product.seller.email}</p>
              )}
            </div>
          )}

          {/* Quantity Selector */}
          {stockStatus.available && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Maximum available: {product.stock}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 mb-6">
            {stockStatus.available ? (
              <>
                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
                >
                  Place Order
                </button>
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-pink-100 text-pink-600 py-3 rounded-lg font-semibold hover:bg-pink-200 transition-colors"
                >
                  Add to Cart
                </button>
              </>
            ) : (
              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed"
              >
                Out of Stock
              </button>
            )}
          </div>

          {/* Description */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Product Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Additional Info */}
          {product.tags && product.tags.length > 0 && (
            <div className="border-t pt-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section (if available) */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="border-t pt-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Customer Reviews ({product.reviews.length})
              </h2>
              <div className="space-y-4">
                {product.reviews.slice(0, 3).map((review, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${i < review.rating ? 'fill-current' : 'fill-gray-300'}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {new Date(review.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
