import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/buyerApi';

export default function Orders() {
  const isLoggedIn = useMemo(() => !!localStorage.getItem('token'), []);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        setError('login_required');
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const resp = await getMyOrders();
        setOrders(resp.data || []);
      } catch (e) {
        setError('Failed to load your orders.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isLoggedIn]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block spinner"></div>
        <p className="mt-4 text-gray-600">Loading your orders...</p>
      </div>
    );
  }

  if (error === 'login_required') {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h3 className="text-lg font-medium text-gray-900">Please login to view your orders</h3>
        <div className="mt-6 flex gap-3 justify-center">
          <Link to="/login" className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">Login</Link>
          <Link to="/" className="px-4 py-2 border rounded-lg hover:bg-gray-50">Home</Link>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-semibold mb-2">Order History</h1>
        <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
        <Link to="/products" className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Order History</h1>
      <div className="space-y-6">
        {orders.map((order) => {
          const items = order.items || order.orderItems || [];
          const total = order.totalAmount || order.total || 0;
          const status = order.status || 'Processing';
          return (
            <div key={order._id} className="bg-white border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <div className="text-sm text-gray-500">Order ID</div>
                  <div className="font-semibold">{order._id}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Placed On</div>
                  <div>{new Date(order.createdAt).toLocaleString()}</div>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-8 space-y-3">
                  {items.map((it, idx) => {
                    const product = it.product || it.productId || {};
                    const name = product.name || it.name || 'Product';
                    const image = (product.images && product.images[0]?.url) || it.image || 'https://via.placeholder.com/80';
                    const price = it.price || product.price || 0;
                    const quantity = it.quantity || 1;
                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <img src={image} alt={name} className="w-16 h-16 rounded object-cover" />
                        <div className="flex-1">
                          <div className="font-medium">{name}</div>
                          <div className="text-sm text-gray-600">Qty: {quantity}</div>
                        </div>
                        <div className="font-semibold">₹{(price * quantity).toLocaleString('en-IN')}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="col-span-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Status</span>
                      <span className="font-medium">{status}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Total</span>
                      <span className="font-semibold">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-right mt-3">
                      <Link to={`/orders/${order._id}`} className="text-pink-600 hover:underline">View Details</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

