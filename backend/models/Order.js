const mongoose = require('mongoose');
const Counter = require('./Counter');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true
    // Not required here - will be set in pre-save hook
  },
  orderNumber: {
    type: Number,
    unique: true
    // Not required here - will be set in pre-save hook
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  buyerName: {
    type: String,
    required: true
  },
  buyerPhone: {
    type: String,
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    productImage: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  deliveryAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'India'
    }
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['stripe', 'paypal', 'cash_on_delivery', 'cod'],
    default: 'cod'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveredAt: Date,
  trackingNumber: String,
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ 'items.seller': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderId: 1 });

// Generate unique order ID and number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    // Get next sequential order number
    const orderNumber = await Counter.getNextSequence('orderCounter');
    this.orderNumber = orderNumber;
    this.orderId = `ORD${String(orderNumber).padStart(4, '0')}`; // e.g., ORD0001, ORD0002
  }
  this.itemsPrice = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  this.totalPrice = this.itemsPrice + this.taxPrice + this.shippingPrice;
  next();
});

module.exports = mongoose.model('Order', orderSchema);
