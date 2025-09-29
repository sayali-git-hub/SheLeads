const express = require('express');
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, asyncHandler(async (req, res) => {
  const {
    items,
    shippingAddress,
    paymentMethod
  } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  const orderItems = [];
  let totalPrice = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.product}`);
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for product: ${product.name}`);
    }

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price,
      seller: product.seller
    });
    totalPrice += product.price * item.quantity;
  }

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice: totalPrice,
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice: totalPrice
  });

  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity }
    });
  }

  res.status(201).json({
    success: true,
    data: order
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

  order.status = status || order.status;
  if (trackingNumber) {
    order.trackingNumber = trackingNumber;
  }
  if (status === 'delivered') {
    order.deliveredAt = Date.now();
  }

  const updatedOrder = await order.save();

  res.json({
    success: true,
    data: updatedOrder
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
