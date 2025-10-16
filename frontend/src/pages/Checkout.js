import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaLock, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { createOrder } from '../services/buyerApi';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get cart items from navigation state
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    phone: ''
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to continue with checkout');
      navigate('/login', { state: { from: '/checkout', cartItems: location.state?.cartItems } });
      return;
    }

    // Get items from location state (passed from Cart)
    if (location.state?.cartItems && location.state.cartItems.length > 0) {
      setCartItems(location.state.cartItems);
    } else {
      // If no items, redirect to cart page
      toast.error('No items found in cart');
      navigate('/cart');
    }
  }, [location, navigate]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping
  const tax = 0; // No tax for now
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to place an order');
        navigate('/login');
        return;
      }

      // Validate form data
      if (!formData.firstName || !formData.lastName || !formData.address || 
          !formData.city || !formData.state || !formData.zipCode || !formData.phone) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          product: item.product,
          quantity: item.quantity
        })),
        deliveryAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: paymentMethod,
        buyerName: `${formData.firstName} ${formData.lastName}`,
        buyerPhone: formData.phone
      };

      console.log('Cart items:', cartItems);
      console.log('Placing order with data:', JSON.stringify(orderData, null, 2));
      const response = await createOrder(orderData);
      console.log('Order response:', response);
      
      setPlacedOrderId(response.data.orderId);
      setOrderPlaced(true);
      setStep(4);
      toast.success('Order placed successfully!');
    } catch (err) {
      console.error('Error placing order:', err);
      console.error('Error response:', err.response?.data);
      
      // Show specific error message
      let errorMessage = 'Failed to place order. Please try again.';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        // Check if error is an array
        if (Array.isArray(err.response.data.error)) {
          errorMessage = err.response.data.error.join(', ');
        } else {
          errorMessage = err.response.data.error;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      console.error('Final error message:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-12 text-center">
            <div className="flex justify-center">
              <FaCheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Order Confirmed!</h2>
            <p className="mt-2 text-lg text-gray-600">
              Thank you for your purchase!
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Your order #{placedOrderId || 'PENDING'} has been placed and will be shipped soon.
            </p>
            <div className="mt-8">
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                Continue Shopping
              </Link>
            </div>
            <div className="mt-4">
              <Link to="/orders" className="text-pink-600 hover:text-pink-500 text-sm font-medium">
                View order details <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-24 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Checkout</h1>
        
        {/* Progress steps */}
        <div className="mt-8">
          <nav aria-label="Progress">
            <ol className="flex items-center">
              <li className="relative pr-8 sm:pr-20">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className={`h-0.5 w-full ${step > 1 ? 'bg-pink-600' : 'bg-gray-200'}`} />
                </div>
                <div className={`relative flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-pink-600' : 'bg-white border-2 border-gray-300'}`}>
                  {step > 1 ? (
                    <span className="text-white">✓</span>
                  ) : (
                    <span className={step === 1 ? 'text-pink-600' : 'text-gray-500'}>1</span>
                  )}
                </div>
                <span className={`mt-2 block text-sm font-medium ${step >= 1 ? 'text-pink-600' : 'text-gray-500'}`}>
                  Shipping
                </span>
              </li>
              
              <li className="relative pr-8 sm:pr-20">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className={`h-0.5 w-full ${step > 2 ? 'bg-pink-600' : 'bg-gray-200'}`} />
                </div>
                <div className={`relative flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-pink-600' : 'bg-white border-2 border-gray-300'}`}>
                  {step > 2 ? (
                    <span className="text-white">✓</span>
                  ) : (
                    <span className={step === 2 ? 'text-pink-600' : 'text-gray-500'}>2</span>
                  )}
                </div>
                <span className={`mt-2 block text-sm font-medium ${step >= 2 ? 'text-pink-600' : 'text-gray-500'}`}>
                  Payment
                </span>
              </li>
              
              <li className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className={`h-0.5 w-full ${step > 3 ? 'bg-pink-600' : 'bg-gray-200'}`} />
                </div>
                <div className={`relative flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-pink-600' : 'bg-white border-2 border-gray-300'}`}>
                  <span className={step === 3 ? 'text-pink-600' : 'text-gray-500'}>3</span>
                </div>
                <span className={`mt-2 block text-sm font-medium ${step >= 3 ? 'text-pink-600' : 'text-gray-500'}`}>
                  Review
                </span>
              </li>
            </ol>
          </nav>
        </div>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12">
          {/* Checkout form */}
          <div className="lg:col-span-7">
            {step === 1 && (
              <form className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Contact information</h2>
                  <div className="mt-4">
                    <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        id="email-address"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-lg font-medium text-gray-900">Shipping information</h2>
                  <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <div>
                      <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                        First name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="first-name"
                          name="firstName"
                          autoComplete="given-name"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                        Last name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="last-name"
                          name="lastName"
                          autoComplete="family-name"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="address"
                          id="address"
                          autoComplete="street-address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="city"
                          id="city"
                          autoComplete="address-level2"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <div className="mt-1">
                        <select
                          id="country"
                          name="country"
                          autoComplete="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          required
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        >
                          <option>India</option>
                          <option>United States</option>
                          <option>Canada</option>
                          <option>United Kingdom</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                        State / Province
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="state"
                          id="region"
                          autoComplete="address-level1"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
                        Postal code
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="zipCode"
                          id="postal-code"
                          autoComplete="postal-code"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="phone"
                          id="phone"
                          autoComplete="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="bg-pink-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Payment</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    All transactions are secure and encrypted.
                  </p>
                </div>

                <div className="mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="cod"
                        name="payment-method"
                        type="radio"
                        className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                      />
                      <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                        Cash on Delivery
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="credit"
                        name="payment-method"
                        type="radio"
                        className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                        checked={paymentMethod === 'credit'}
                        onChange={() => setPaymentMethod('credit')}
                      />
                      <label htmlFor="credit" className="ml-3 block text-sm font-medium text-gray-700">
                        Credit/Debit Card
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="paypal"
                        name="payment-method"
                        type="radio"
                        className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                      />
                      <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">
                        PayPal
                      </label>
                    </div>
                  </div>

                  {paymentMethod === 'credit' && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                          Card number
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="card-number"
                            name="card-number"
                            autoComplete="cc-number"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                            placeholder="0000 0000 0000 0000"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">
                            Expiration date (MM/YY)
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="expiration-date"
                              id="expiration-date"
                              autoComplete="cc-exp"
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                              placeholder="MM / YY"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                            CVC
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="cvc"
                              id="cvc"
                              autoComplete="cc-csc"
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                              placeholder="CVC"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="name-on-card" className="block text-sm font-medium text-gray-700">
                          Name on card
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="name-on-card"
                            name="name-on-card"
                            autoComplete="cc-name"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="bg-pink-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    Review Order
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handlePlaceOrder}>
                <h2 className="text-lg font-medium text-gray-900">Review your order</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Please review your information before placing your order.
                </p>

                <div className="mt-6 bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <h3 className="sr-only">Items in your cart</h3>
                  <ul className="divide-y divide-gray-200">
                    {cartItems.map((item, index) => (
                      <li key={item.product || index} className="flex py-6 px-4 sm:px-6">
                        <div className="flex-shrink-0">
                          <img
                            src={item.image || 'https://via.placeholder.com/100'}
                            alt={item.name}
                            className="w-20 rounded-md"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                            }}
                          />
                        </div>

                        <div className="ml-6 flex-1 flex flex-col">
                          <div className="flex">
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm">
                                <span className="font-medium text-gray-700">
                                  {item.name}
                                </span>
                              </h4>
                              <p className="mt-1 text-sm text-gray-500">Quantity: {item.quantity}</p>
                            </div>
                          </div>

                          <div className="flex-1 pt-2 flex items-end justify-between">
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <dl className="border-t border-gray-200 py-6 px-4 space-y-6 sm:px-6">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm">Subtotal</dt>
                      <dd className="text-sm font-medium text-gray-900">₹{subtotal.toLocaleString('en-IN')}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-sm">Shipping</dt>
                      <dd className="text-sm font-medium text-gray-900">{shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-sm">Tax</dt>
                      <dd className="text-sm font-medium text-gray-900">₹{tax.toLocaleString('en-IN')}</dd>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                      <dt className="text-base font-medium">Total</dt>
                      <dd className="text-base font-medium text-gray-900">₹{total.toLocaleString('en-IN')}</dd>
                    </div>
                  </dl>
                </div>

                {error && (
                  <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={loading}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-pink-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Order summary */}
          <div className="mt-10 lg:mt-0 lg:col-span-5">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

              <div className="mt-6">
                <h3 className="sr-only">Items in your cart</h3>
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item, index) => (
                    <li key={item.product || index} className="py-4 flex">
                      <div className="flex-shrink-0">
                        <img
                          src={item.image || 'https://via.placeholder.com/100'}
                          alt={item.name}
                          className="w-20 rounded-md"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{item.name}</h3>
                            <p className="ml-4">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">Qty {item.quantity}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <dl className="border-t border-gray-200 mt-6 pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm">Subtotal</dt>
                    <dd className="text-sm font-medium text-gray-900">₹{subtotal.toLocaleString('en-IN')}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm">Shipping</dt>
                    <dd className="text-sm font-medium text-gray-900">{shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm">Tax</dt>
                    <dd className="text-sm font-medium text-gray-900">₹{tax.toLocaleString('en-IN')}</dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <dt className="text-base font-medium">Total</dt>
                    <dd className="text-base font-medium text-gray-900">₹{total.toLocaleString('en-IN')}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
              <FaLock className="h-4 w-4 text-gray-300 mr-1.5" />
              <span>Secure checkout with SSL encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
