const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  businessName: {
    type: String,
    required: [true, 'Please provide a business name'],
    trim: true,
    maxlength: [100, 'Business name cannot exceed 100 characters']
  },
  businessAddress: {
    type: String,
    required: [true, 'Please provide a business address'],
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  bankDetails: {
    accountHolderName: {
      type: String,
      required: [true, 'Please provide account holder name']
    },
    accountNumber: {
      type: String,
      required: [true, 'Please provide account number']
    },
    ifscCode: {
      type: String,
      required: [true, 'Please provide IFSC code'],
      match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please provide a valid IFSC code']
    }
  },
  statistics: {
    totalSales: {
      type: Number,
      default: 0
    },
    totalOrders: {
      type: Number,
      default: 0
    },
    totalProducts: {
      type: Number,
      default: 0
    }
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

sellerSchema.index({ user: 1 });
sellerSchema.index({ isApproved: 1, isActive: 1 });

module.exports = mongoose.model('Seller', sellerSchema);
