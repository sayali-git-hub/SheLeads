import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaHeart, FaShare, FaChevronLeft, FaMinus, FaPlus } from 'react-icons/fa';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  
  // In a real app, this would be fetched from an API
  const product = {
    id: parseInt(id),
    name: 'Floral Summer Dress',
    price: 59.99,
    description: 'A beautiful floral summer dress perfect for any occasion. Made with high-quality, breathable fabric for maximum comfort.',
    images: [
      'https://via.placeholder.com/800x1000',
      'https://via.placeholder.com/800x1000/CCCCCC',
      'https://via.placeholder.com/800x1000/999999',
      'https://via.placeholder.com/800x1000/666666',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Pink', 'Blue', 'White', 'Black'],
    details: [
      '100% Cotton',
      'Machine washable',
      'Imported',
      'Adjustable straps',
      'Knee length',
      'Flared silhouette'
    ],
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
  };

  const [mainImage, setMainImage] = useState(product.images[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [isWishlist, setIsWishlist] = useState(false);

  const handleAddToCart = () => {
    // In a real app, this would add the item to the cart
    console.log({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity,
      image: product.images[0]
    });
    
    // Redirect to cart or show a success message
    // navigate('/cart');
  };

  const renderRating = () => {
    const stars = [];
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    
    return (
      <div className="flex items-center mt-1">
        <div className="flex">
          {stars}
        </div>
        <p className="ml-2 text-sm text-gray-500">
          {product.rating} ({product.reviewCount} reviews)
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <FaChevronLeft className="mr-2" /> Back to products
        </button>
        
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Image gallery */}
          <div className="flex flex-col-reverse">
            <div className="mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <div 
                    key={index}
                    onClick={() => setMainImage(image)}
                    className={`relative rounded-lg overflow-hidden h-24 cursor-pointer ${
                      mainImage === image ? 'ring-2 ring-pink-500' : 'ring-1 ring-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="w-full h-96 rounded-lg overflow-hidden">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {product.name}
            </h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-gray-900">${product.price.toFixed(2)}</p>
              {renderRating()}
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 space-y-6">
                <p>{product.description}</p>
              </div>
            </div>

            <form className="mt-6">
              {/* Colors */}
              <div>
                <h3 className="text-sm text-gray-600">Color</h3>
                <div className="flex items-center space-x-3 mt-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        selectedColor === color ? 'ring-2 ring-pink-500' : 'ring-1 ring-gray-200'
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                    >
                      <span className="sr-only">{color}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm text-gray-600">Size</h3>
                  <a href="#" className="text-sm font-medium text-pink-600 hover:text-pink-500">
                    Size guide
                  </a>
                </div>

                <div className="grid grid-cols-5 gap-3 mt-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-3 border rounded-md text-sm font-medium ${
                        selectedSize === size
                          ? 'bg-pink-600 text-white border-transparent'
                          : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-8">
                <label htmlFor="quantity" className="text-sm text-gray-600">
                  Quantity
                </label>
                <div className="flex items-center mt-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded-l-md"
                  >
                    <span className="sr-only">Decrease quantity</span>
                    <FaMinus className="h-3 w-3" />
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-16 text-center border-t border-b border-gray-300 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 border border-gray-300 rounded-r-md"
                  >
                    <span className="sr-only">Increase quantity</span>
                    <FaPlus className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 bg-pink-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  <FaShoppingCart className="mr-2" />
                  Add to cart
                </button>
                <button
                  type="button"
                  onClick={() => setIsWishlist(!isWishlist)}
                  className="flex-1 bg-white border border-gray-300 rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  <FaHeart className={`mr-2 ${isWishlist ? 'text-pink-600 fill-current' : 'text-gray-400'}`} />
                  {isWishlist ? 'In Wishlist' : 'Wishlist'}
                </button>
                <button
                  type="button"
                  className="p-3 border border-gray-300 rounded-md text-gray-400 hover:bg-gray-50"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: product.name,
                        text: `Check out ${product.name} on SheLead`,
                        url: window.location.href,
                      });
                    }
                  }}
                >
                  <span className="sr-only">Share</span>
                  <FaShare className="h-5 w-5" />
                </button>
              </div>
            </form>

            {/* Product details */}
            <section className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Details</h3>
              <div className="mt-4">
                <ul className="list-disc pl-4 space-y-2 text-sm text-gray-600">
                  {product.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
