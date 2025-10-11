const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Seller = require('../models/Seller');
const Notification = require('../models/Notification');

// @desc    Get seller dashboard statistics
// @route   GET /api/seller/dashboard
// @access  Private/Seller
router.get('/dashboard', protect, authorize('seller', 'admin'), async (req, res) => {
  try {
    const sellerId = req.user.id;

    // Get total sales
    const orders = await Order.find({ 'items.seller': sellerId });
    const totalSales = orders.reduce((sum, order) => {
      const sellerItems = order.items.filter(item => item.seller.toString() === sellerId);
      return sum + sellerItems.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
    }, 0);

    // Get pending and completed orders count
    const pendingOrders = orders.filter(order => 
      order.status === 'pending' || order.status === 'processing'
    ).length;
    const completedOrders = orders.filter(order => order.status === 'delivered').length;

    // Get low stock products (stock < 10)
    const lowStockProducts = await Product.find({ 
      seller: sellerId, 
      stock: { $lt: 10, $gt: 0 } 
    }).countDocuments();

    // Get sales data for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentOrders = await Order.find({
      'items.seller': sellerId,
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Group sales by day
    const salesByDay = Array(30).fill(0);
    recentOrders.forEach(order => {
      const dayIndex = Math.floor((new Date() - new Date(order.createdAt)) / (1000 * 60 * 60 * 24));
      if (dayIndex < 30) {
        const sellerItems = order.items.filter(item => item.seller.toString() === sellerId);
        const orderTotal = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        salesByDay[29 - dayIndex] += orderTotal;
      }
    });

    // Get top selling products
    const products = await Product.find({ seller: sellerId });
    const productSales = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.seller.toString() === sellerId) {
          const productId = item.product.toString();
          productSales[productId] = (productSales[productId] || 0) + item.quantity;
        }
      });
    });

    const topProducts = await Promise.all(
      Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(async ([productId, sales]) => {
          const product = await Product.findById(productId);
          return {
            id: productId,
            name: product?.name || 'Unknown Product',
            sales
          };
        })
    );

    res.status(200).json({
      success: true,
      data: {
        totalSales,
        pendingOrders,
        completedOrders,
        lowStockItems: lowStockProducts,
        salesData: {
          labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
          values: salesByDay
        },
        topSellingProducts: topProducts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
});

// @desc    Get seller profile
// @route   GET /api/seller/profile
// @access  Private/Seller
router.get('/profile', protect, authorize('seller', 'admin'), async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user.id }).populate('user', 'name email phone');
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: seller
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching seller profile',
      error: error.message
    });
  }
});

// @desc    Update seller profile
// @route   PUT /api/seller/profile
// @access  Private/Seller
router.put('/profile', protect, authorize('seller', 'admin'), async (req, res) => {
  try {
    const { businessName, businessAddress, bankDetails, contactNumber, email } = req.body;

    let seller = await Seller.findOne({ user: req.user.id });
    
    if (!seller) {
      // Create new seller profile if doesn't exist
      seller = await Seller.create({
        user: req.user.id,
        businessName,
        businessAddress,
        bankDetails
      });
    } else {
      // Update existing profile
      seller.businessName = businessName || seller.businessName;
      seller.businessAddress = businessAddress || seller.businessAddress;
      if (bankDetails) {
        seller.bankDetails = { ...seller.bankDetails, ...bankDetails };
      }
      await seller.save();
    }

    // Update user info if provided
    if (contactNumber || email) {
      const user = await User.findById(req.user.id);
      if (contactNumber) user.phone = contactNumber;
      if (email) user.email = email;
      await user.save();
    }

    res.status(200).json({
      success: true,
      data: seller,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating seller profile',
      error: error.message
    });
  }
});

// @desc    Get all products for seller
// @route   GET /api/seller/products
// @access  Private/Seller
router.get('/products', protect, authorize('seller', 'admin'), async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// @desc    Create new product
// @route   POST /api/seller/products
// @access  Private/Seller
router.post('/products', protect, authorize('seller', 'admin'), async (req, res) => {
  try {
    const productData = {
      ...req.body,
      seller: req.user.id,
      isActive: req.body.status !== undefined ? req.body.status : true
    };

    const product = await Product.create(productData);

    // Update seller statistics
    await Seller.findOneAndUpdate(
      { user: req.user.id },
      { $inc: { 'statistics.totalProducts': 1 } }
    );

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
});

// @desc    Update product
// @route   PUT /api/seller/products/:id
// @access  Private/Seller
router.put('/products/:id', protect, authorize('seller', 'admin'), async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user is the product owner
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    // Update isActive field based on status
    if (req.body.status !== undefined) {
      req.body.isActive = req.body.status;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
});

// @desc    Delete product
// @route   DELETE /api/seller/products/:id
// @access  Private/Seller
router.delete('/products/:id', protect, authorize('seller', 'admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user is the product owner
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    await product.deleteOne();

    // Update seller statistics
    await Seller.findOneAndUpdate(
      { user: req.user.id },
      { $inc: { 'statistics.totalProducts': -1 } }
    );

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
});

// @desc    Get all orders for seller
// @route   GET /api/seller/orders
// @access  Private/Seller
router.get('/orders', protect, authorize('seller', 'admin'), async (req, res) => {
  try {
    const orders = await Order.find({ 'items.seller': req.user.id })
      .populate('user', 'name email phone')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });

    // Filter items to only show seller's products
    const filteredOrders = orders.map(order => {
      const orderObj = order.toObject();
      orderObj.items = orderObj.items.filter(item => item.seller.toString() === req.user.id);
      
      // Recalculate total for seller's items only
      orderObj.totalAmount = orderObj.items.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );
      
      return orderObj;
    });

    res.status(200).json({
      success: true,
      count: filteredOrders.length,
      data: filteredOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// @desc    Update order status
// @route   PUT /api/seller/orders/:id/status
// @access  Private/Seller
router.put('/orders/:id/status', protect, authorize('seller', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if seller has items in this order
    const hasSellerItems = order.items.some(item => item.seller.toString() === req.user.id);
    if (!hasSellerItems) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    order.status = status;
    if (status === 'delivered') {
      order.deliveredAt = Date.now();
    }
    await order.save();

    // Create notification for customer
    await Notification.create({
      user: order.user,
      type: 'order',
      title: 'Order Status Updated',
      message: `Your order #${order._id.toString().slice(-6)} status has been updated to ${status}`,
      relatedId: order._id,
      relatedModel: 'Order'
    });

    res.status(200).json({
      success: true,
      data: order,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
});

// @desc    Get notifications for seller
// @route   GET /api/seller/notifications
// @access  Private/Seller
router.get('/notifications', protect, authorize('seller', 'admin'), async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ 
      user: req.user.id, 
      isRead: false 
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
});

// @desc    Mark notification as read
// @route   PUT /api/seller/notifications/:id/read
// @access  Private/Seller
router.put('/notifications/:id/read', protect, authorize('seller', 'admin'), async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      success: true,
      data: notification,
      message: 'Notification marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating notification',
      error: error.message
    });
  }
});

// @desc    Mark all notifications as read
// @route   PUT /api/seller/notifications/read-all
// @access  Private/Seller
router.put('/notifications/read-all', protect, authorize('seller', 'admin'), async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating notifications',
      error: error.message
    });
  }
});

// @desc    Delete notification
// @route   DELETE /api/seller/notifications/:id
// @access  Private/Seller
router.delete('/notifications/:id', protect, authorize('seller', 'admin'), async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await notification.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting notification',
      error: error.message
    });
  }
});

// @desc    Clear all notifications
// @route   DELETE /api/seller/notifications
// @access  Private/Seller
router.delete('/notifications', protect, authorize('seller', 'admin'), async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user.id });

    res.status(200).json({
      success: true,
      message: 'All notifications cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing notifications',
      error: error.message
    });
  }
});

module.exports = router;
