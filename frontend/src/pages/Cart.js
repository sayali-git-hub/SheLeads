import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { cartGetMine, cartRemoveItem, cartUpdateQuantity } from '../services/buyerApi';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasToken = useMemo(() => !!localStorage.getItem('token'), []);

  useEffect(() => {
    const fetchCart = async () => {
      if (!hasToken) {
        setLoading(false);
        setCartItems([]);
        setError('login_required');
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const resp = await cartGetMine();
        const items = (resp.data || []).map((it) => ({
          _id: it._id,
          productId: it.productId?._id || it.productId,
          name: it.productId?.name || 'Product',
          image: it.productId?.images?.[0]?.url || 'https://via.placeholder.com/100',
          price: it.productId?.price ?? it.priceSnapshot,
          quantity: it.quantity,
        }));
        setCartItems(items);
      } catch (err) {
        console.error('Failed to load cart', err);
        const message = err?.response?.data?.message || 'Failed to load your cart. Please try again.';
        setError(message);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [hasToken]);
  if (error === 'login_required') {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <h3 className="mt-2 text-lg font-medium text-gray-900">Please login to view your cart</h3>
          <p className="mt-1 text-gray-500">Your cart is linked to your account.</p>
          <div className="mt-6 flex gap-3 justify-center">
            <Link to="/login" className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">Login</Link>
            <Link to="/products" className="px-4 py-2 border rounded-lg hover:bg-gray-50">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }


  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await cartUpdateQuantity({ cartItemId, quantity: newQuantity });
      setCartItems((prev) => prev.map((item) => item._id === cartItemId ? { ...item, quantity: newQuantity } : item));
    } catch (err) {
      console.error('Failed to update quantity', err);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await cartRemoveItem(cartItemId);
      setCartItems((prev) => prev.filter((item) => item._id !== cartItemId));
    } catch (err) {
      console.error('Failed to remove item', err);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block spinner"></div>
        <p className="mt-4 text-gray-600">Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-xl mx-auto text-center">{error}</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
          <p className="mt-1 text-gray-500">Start shopping to add items to your cart.</p>
          <div className="mt-6">
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Shopping Cart</h1>
        
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">Items in your shopping cart</h2>
            
            <ul className="border-t border-b border-gray-200 divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li key={item._id} className="flex py-6 sm:py-10">
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 rounded-md object-cover object-center sm:w-32 sm:h-32"
                    />
                  </div>

                  <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm">
                            <Link to={`/products/${item.productId}`} className="font-medium text-gray-700 hover:text-gray-800">
                              {item.name}
                            </Link>
                          </h3>
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-900">₹{item.price.toLocaleString('en-IN')}</p>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <div className="flex items-center">
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="p-1 text-gray-400 hover:text-gray-500"
                          >
                            <FaMinus className="h-3 w-3" />
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="p-1 text-gray-400 hover:text-gray-500"
                          >
                            <FaPlus className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="absolute top-0 right-0">
                          <button 
                            type="button"
                            onClick={() => removeItem(item._id)}
                            className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500"
                          >
                            <FaTrash className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5"
          >
            <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
              Order summary
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">₹{subtotal.toLocaleString('en-IN')}</dd>
              </div>
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <dt className="flex items-center text-sm text-gray-600">
                  <span>Delivery charges</span>
                </dt>
                <dd className="text-sm font-medium text-gray-900">₹{shipping.toLocaleString('en-IN')}</dd>
              </div>
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <dt className="text-base font-medium text-gray-900">Order total</dt>
                <dd className="text-base font-medium text-gray-900">₹{total.toLocaleString('en-IN')}</dd>
              </div>
            </dl>

            <div className="mt-6">
              <Link
                to="/checkout"
                className="w-full bg-pink-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-pink-500 flex items-center justify-center"
              >
                Checkout
              </Link>
            </div>
            
            <div className="mt-6 text-center text-sm">
              <p>
                or{' '}
                <Link to="/products" className="font-medium text-pink-600 hover:text-pink-500">
                  Continue Shopping<span aria-hidden="true"> &rarr;</span>
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Cart;
