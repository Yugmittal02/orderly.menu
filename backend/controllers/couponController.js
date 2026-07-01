const Coupon = require('../models/Coupon');
const Cafe = require('../models/Cafe');

// Create coupon (Cafe Owner)
exports.createCoupon = async (req, res) => {
  try {
    const { code, type, value, minOrder, maxDiscount, usageLimit, expiresAt } = req.body;
    if (!code || !type || !value) return res.status(400).json({ message: 'Code, type, and value are required' });

    const existing = await Coupon.findOne({ cafe: req.user.cafeId, code: code.toUpperCase() });
    if (existing) return res.status(400).json({ message: 'Coupon code already exists' });

    const coupon = new Coupon({
      cafe: req.user.cafeId,
      code: code.toUpperCase(),
      type,
      value,
      minOrder: minOrder || 0,
      maxDiscount: maxDiscount || 0,
      usageLimit: usageLimit || 0,
      expiresAt: expiresAt || null
    });
    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all coupons (Cafe Owner)
exports.getMyCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ cafe: req.user.cafeId }).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update coupon (Cafe Owner)
exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOneAndUpdate(
      { _id: req.params.id, cafe: req.user.cafeId },
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete coupon (Cafe Owner)
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOneAndDelete({ _id: req.params.id, cafe: req.user.cafeId });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle coupon active status (Cafe Owner)
exports.toggleCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ _id: req.params.id, cafe: req.user.cafeId });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Validate coupon (Public — customer use)
exports.validateCoupon = async (req, res) => {
  try {
    const { code, cafeId, orderTotal } = req.body;
    if (!code || !cafeId) return res.status(400).json({ message: 'Code and cafeId required' });

    const cafe = await Cafe.findOne({ cafeId: cafeId.toUpperCase(), isActive: true });
    if (!cafe) return res.status(404).json({ message: 'Cafe not found' });

    const coupon = await Coupon.findOne({ cafe: cafe._id, code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });

    // Check expiry
    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    // Check usage limit
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }

    // Check minimum order
    if (orderTotal < coupon.minOrder) {
      return res.status(400).json({ message: `Minimum order ₹${coupon.minOrder} required` });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = Math.round((orderTotal * coupon.value) / 100);
      if (coupon.maxDiscount > 0) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = coupon.value;
    }
    discount = Math.min(discount, orderTotal); // Can't exceed total

    res.json({
      valid: true,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount,
      message: `₹${discount} off applied!`
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
