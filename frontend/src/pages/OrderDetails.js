import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrderById } from '../services/buyerApi';

export default function OrderDetails() {
  const { id } = useParams();
  const isLoggedIn = useMemo(() => !!localStorage.getItem('token'), []);
  const [order, setOrder] = useState(null);
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
        const resp = await getOrderById(id);
        setOrder(resp.data || null);
      } catch (e) {
        setError('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isLoggedIn]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block spinner"></div>
        <p className="mt-4 text-gray-600">Loading order...</p>
      </div>
    );
  }

  if (error === 'login_required') {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h3 className="text-lg font-medium text-gray-900">Please login to view this order</h3>
        <div className="mt-6 flex gap-3 justify-center">
          <Link to="/login" className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">Login</Link>
          <Link to="/orders" className="px-4 py-2 border rounded-lg hover:bg-gray-50">Back to Orders</Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h3 className="text-lg font-medium text-gray-900">Order not found</h3>
        <div className="mt-6">
          <Link to="/orders" className="px-4 py-2 border rounded-lg hover:bg-gray-50">Back to Orders</Link>
        </div>
      </div>
    );
  }

  const items = order.items || order.orderItems || [];
  const total = order.totalAmount || order.total || 0;
  const status = order.status || 'Processing';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 text-sm text-gray-500">
        <Link to="/orders" className="hover:underline">Orders</Link> <span className="mx-1">›</span> <span>{order._id}</span>
      </div>
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          {items.map((it, idx) => {
            const product = it.product || it.productId || {};
            const name = product.name || it.name || 'Product';
            const image = (product.images && product.images[0]?.url) || it.image || 'https://via.placeholder.com/80';
            const price = it.price || product.price || 0;
            const quantity = it.quantity || 1;
            return (
              <div key={idx} className="flex items-center gap-3 border rounded-lg p-3">
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
        <div>
          <div className="bg-white border rounded-lg p-4">
            <div className="mb-2">
              <div className="text-gray-600 text-sm">Order ID</div>
              <div className="font-medium">{order._id}</div>
            </div>
            <div className="mb-2">
              <div className="text-gray-600 text-sm">Status</div>
              <div className="font-medium">{status}</div>
            </div>
            <div className="mb-2">
              <div className="text-gray-600 text-sm">Placed On</div>
              <div className="font-medium">{new Date(order.createdAt).toLocaleString()}</div>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between">
              <span className="text-gray-600">Total</span>
              <span className="font-semibold">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

