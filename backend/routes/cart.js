const express = require('express');
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/auth');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

const router = express.Router();

// POST /api/cart -> add or increment item
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Invalid payload' });
    }
    const product = await Product.findById(productId).select('price images name');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const priceSnapshot = product.price;
    const existing = await CartItem.findOne({ buyerId: req.user._id, productId });
    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return res.json({ success: true, data: existing });
    }
    const item = await CartItem.create({ buyerId: req.user._id, productId, quantity, priceSnapshot });
    res.status(201).json({ success: true, data: item });
  })
);

// GET /api/cart/my -> list items for authenticated buyer
router.get(
  '/my',
  protect,
  asyncHandler(async (req, res) => {
    const items = await CartItem.find({ buyerId: req.user._id })
      .populate({ path: 'productId', select: 'name price images' })
      .sort('-createdAt');
    res.json({ success: true, data: items });
  })
);

// GET /api/cart/:buyerId -> list items for buyer (must match auth user)
router.get(
  '/:buyerId',
  protect,
  asyncHandler(async (req, res) => {
    if (req.params.buyerId !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    const items = await CartItem.find({ buyerId: req.user._id })
      .populate({ path: 'productId', select: 'name price images' })
      .sort('-createdAt');
    res.json({ success: true, data: items });
  })
);

// PUT /api/cart/:id -> update quantity
router.put(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be >= 1' });
    }
    const item = await CartItem.findOne({ _id: req.params.id, buyerId: req.user._id });
    if (!item) return res.status(404).json({ success: false, message: 'Cart item not found' });
    item.quantity = quantity;
    await item.save();
    res.json({ success: true, data: item });
  })
);

// DELETE /api/cart/:id -> remove item
router.delete(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const item = await CartItem.findOneAndDelete({ _id: req.params.id, buyerId: req.user._id });
    if (!item) return res.status(404).json({ success: false, message: 'Cart item not found' });
    res.json({ success: true });
  })
);

module.exports = router;

