const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    priceSnapshot: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

CartItemSchema.index({ buyerId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model('CartItem', CartItemSchema);

