const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

// Static method to get next sequence value
counterSchema.statics.getNextSequence = async function(counterName) {
  const counter = await this.findOneAndUpdate(
    { name: counterName },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return counter.value;
};

module.exports = mongoose.model('Counter', counterSchema);
