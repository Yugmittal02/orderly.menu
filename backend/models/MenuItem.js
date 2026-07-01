const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  cafe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cafe',
    required: true
  },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, default: '' },
  category: {
    type: String,
    required: true,
    trim: true,
    default: 'Other'
  },
  isVeg: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true },
  preparationTime: { type: Number, default: 15 }, // minutes
  sortOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

menuItemSchema.index({ cafe: 1, category: 1 });
menuItemSchema.index({ cafe: 1, isAvailable: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
