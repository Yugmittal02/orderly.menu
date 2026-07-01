const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  cafe: { type: mongoose.Schema.Types.ObjectId, ref: 'Cafe', required: true },
  code: { type: String, required: true, uppercase: true, trim: true },
  type: { type: String, enum: ['percentage', 'flat'], required: true },
  value: { type: Number, required: true, min: 1 },
  minOrder: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: 0 }, // 0 = no cap
  usageLimit: { type: Number, default: 0 }, // 0 = unlimited
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

couponSchema.index({ cafe: 1, code: 1 }, { unique: true });
couponSchema.index({ cafe: 1, isActive: 1 });

module.exports = mongoose.model('Coupon', couponSchema);
