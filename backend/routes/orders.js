const express = require('express');
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, asyncHandler(async (req, res) => {
  const {
    items,
    shippingAddress,
    deliveryAddress,
    paymentMethod,
    buyerName,
    buyerPhone
  } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  const orderItems = [];
  let totalPrice = 0;
  const sellers = new Set();

  // Validate all products and check stock
  for (const item of items) {
    const product = await Product.findById(item.product).populate('seller', 'name email');
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.product}`);
    }
    
    // Check if product is active and has stock
    if (!product.isActive) {
      res.status(400);
      throw new Error(`Product ${product.name} is not available`);
    }
    
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Only ${product.stock} items available for product: ${product.name}`);
    }

    orderItems.push({
      product: product._id,
      productName: product.name,
      productImage: product.images && product.images.length > 0 ? product.images[0].url : '',
      quantity: item.quantity,
      price: product.price,
      seller: product.seller._id
    });
    totalPrice += product.price * item.quantity;
    sellers.add(product.seller._id.toString());
  }

  // Get buyer details
  const buyer = await User.findById(req.user._id);
  
  // Create order (DO NOT reduce stock yet - only after seller confirms)
  const order = await Order.create({
    user: req.user._id,
    buyerName: buyerName || buyer.name,
    buyerPhone: buyerPhone || buyer.phone || 'N/A',
    items: orderItems,
    shippingAddress: shippingAddress || deliveryAddress,
    deliveryAddress: deliveryAddress || shippingAddress,
    paymentMethod: paymentMethod || 'cod',
    paymentStatus: 'pending',
    itemsPrice: totalPrice,
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice: totalPrice,
    status: 'pending'
  });

  // Create notifications for each seller
  for (const sellerId of sellers) {
    const sellerItems = orderItems.filter(item => item.seller.toString() === sellerId);
    const itemsList = sellerItems.map(item => `${item.productName} (Qty: ${item.quantity})`).join(', ');
    
    await Notification.create({
      user: sellerId,
      type: 'new_order',
      title: 'New Order Received',
      message: `Order #${order.orderId} - Products: ${itemsList}`,
      relatedId: order._id,
      relatedModel: 'Order',
      isRead: false
    });
  }

  // Populate order for response
  const populatedOrder = await Order.findById(order._id)
    .populate('items.product', 'name images')
    .populate('items.seller', 'name');

  res.status(201).json({
    success: true,
    data: populatedOrder,
    message: `Order placed successfully! Order ID: #${order.orderId}`
  });
}));

router.get('/my-orders', protect, asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('items.product', 'name images price')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: orders
  });
}));

router.get('/seller-orders', protect, asyncHandler(async (req, res) => {
  const orders = await Order.find({
    'items.seller': req.user._id
  })
    .populate('user', 'name email')
    .populate('items.product', 'name images price')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: orders
  });
}));

router.get('/:id', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('items.product', 'name images price')
    .populate('items.seller', 'name');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user._id.toString() !== req.user._id.toString() && 
      !order.items.some(item => item.seller._id.toString() === req.user._id.toString()) &&
      req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json({
    success: true,
    data: order
  });
}));

router.put('/:id/status', protect, asyncHandler(async (req, res) => {
  const { status, trackingNumber } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isSeller = order.items.some(item => 
    item.seller.toString() === req.user._id.toString()
  );

  if (!isSeller && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this order');
  }

  const oldStatus = order.status;
  order.status = status || order.status;
  
  if (trackingNumber) {
    order.trackingNumber = trackingNumber;
  }
  if (status === 'delivered') {
    order.deliveredAt = Date.now();
  }

  // If seller confirms order (pending -> confirmed), reduce stock
  if (oldStatus === 'pending' && status === 'confirmed') {
    for (const item of order.items) {
      if (item.seller.toString() === req.user._id.toString()) {
        const product = await Product.findById(item.product);
        if (product) {
          const newStock = product.stock - item.quantity;
          product.stock = newStock;
          
          // If stock becomes 0, set product as inactive
          if (newStock <= 0) {
            product.isActive = false;
            product.stock = 0;
          }
          
          await product.save();
        }
      }
    }
    
    // Create notification for buyer
    await Notification.create({
      user: order.user,
      type: 'order_confirmed',
      title: 'Order Confirmed',
      message: `Your order #${order.orderId} has been confirmed by the seller`,
      relatedId: order._id,
      relatedModel: 'Order',
      isRead: false
    });
  }

  const updatedOrder = await order.save();

  res.json({
    success: true,
    data: updatedOrder,
    message: status === 'confirmed' ? 'Order confirmed! Stock updated.' : 'Order status updated successfully'
  });
}));

router.post('/:id/payment', protect, asyncHandler(async (req, res) => {
  const { paymentResult } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this order');
  }

  order.paymentResult = paymentResult;
  order.status = 'processing';

  const updatedOrder = await order.save();

  res.json({
    success: true,
    data: updatedOrder
  });
}));

module.exports = router;
