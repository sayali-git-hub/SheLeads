const express = require('express');
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  
  const query = {};
  
  if (req.query.category) {
    query.category = req.query.category;
  }
  
  if (req.query.seller) {
    query.seller = req.query.seller;
  }
  
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }
  
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) {
      query.price.$gte = parseFloat(req.query.minPrice);
    }
    if (req.query.maxPrice) {
      query.price.$lte = parseFloat(req.query.maxPrice);
    }
  }
  
  query.isActive = true;
  
  const products = await Product.find(query)
    .populate('seller', 'name profileImage')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
  const total = await Product.countDocuments(query);
  
  res.json({
    success: true,
    data: products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

router.get('/featured', asyncHandler(async (req, res) => {
  const products = await Product.find({ featured: true, isActive: true })
    .populate('seller', 'name profileImage')
    .sort({ createdAt: -1 })
    .limit(8);
    
  res.json({
    success: true,
    data: products
  });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('seller', 'name profileImage bio');
    
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  res.json({
    success: true,
    data: product
  });
}));

router.post('/', protect, authorize('seller', 'admin'), asyncHandler(async (req, res) => {
  const { name, description, price, category, images, stock, tags } = req.body;
  
  const product = await Product.create({
    name,
    description,
    price,
    category,
    images,
    seller: req.user._id,
    stock,
    tags: tags || []
  });
  
  res.status(201).json({
    success: true,
    data: product
  });
}));

router.put('/:id', protect, authorize('seller', 'admin'), asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this product');
  }
  
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.json({
    success: true,
    data: product
  });
}));

router.delete('/:id', protect, authorize('seller', 'admin'), asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this product');
  }
  
  await product.remove();
  
  res.json({
    success: true,
    data: {}
  });
}));

router.post('/:id/reviews', protect, asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  const alreadyReviewed = product.reviews.find(
    r => r.user.toString() === req.user._id.toString()
  );
  
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }
  
  const review = {
    user: req.user._id,
    rating: Number(rating),
    comment
  };
  
  product.reviews.push(review);
  
  await product.save();
  
  res.status(201).json({
    success: true,
    data: product
  });
}));

module.exports = router;
