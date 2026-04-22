const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, optionalVerifyToken, isAdmin } = require('../middleware/authMiddleware');
const { validateOrder, validateObjectId } = require('../middleware/validation');

// Guest order creation (no auth required, but validated, checks for token optionally)
router.post('/', optionalVerifyToken, validateOrder, orderController.createOrder);
router.get('/track/:id', validateObjectId('id'), orderController.trackOrder);

// Authenticated routes
router.get('/my-orders', verifyToken, orderController.getUserOrders);
router.get('/all', verifyToken, isAdmin, orderController.getAllOrders);
router.put('/:id/status', verifyToken, isAdmin, validateObjectId('id'), orderController.updateOrderStatus);
router.put('/:id/accept', verifyToken, isAdmin, validateObjectId('id'), orderController.acceptOrder);

// Cancel order (customer can cancel within 30 seconds)
router.put('/:id/cancel', validateObjectId('id'), orderController.cancelOrder);

// Payment screenshot upload (customer - no auth required, uses order ID)
router.put('/:id/screenshot', validateObjectId('id'), orderController.uploadPaymentScreenshot);

// Admin: Verify payment screenshot
router.put('/:id/verify-payment', verifyToken, isAdmin, validateObjectId('id'), orderController.verifyPaymentScreenshot);

// ═══════════════════════════════════════════
// RESET ALL ORDERS & STATS (Admin only, password-protected)
// Deletes: Orders, Ratings
// Does NOT touch: Products, Categories, Settings, Users, Offers
// ═══════════════════════════════════════════
router.delete('/reset-all', verifyToken, isAdmin, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Settings password is required for this action' });
    }

    // Verify password against store_config settings
    const Settings = require('../models/Settings');
    const bcrypt = require('bcryptjs');
    let settings = await Settings.findOne({ key: 'store_config' });

    if (!settings) {
      return res.status(500).json({ message: 'Settings not configured' });
    }

    const isMatch = await bcrypt.compare(password, settings.settingsPassword);

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect settings password' });
    }

    // Delete all orders and ratings — menu/products/categories are UNTOUCHED
    const Order = require('../models/Order');
    const Rating = require('../models/Rating');

    const orderResult = await Order.deleteMany({});
    const ratingResult = await Rating.deleteMany({});

    // Also clear user activity logs related to orders
    const User = require('../models/User');
    await User.updateMany({}, { $set: { activityLog: [] } });

    console.log(`🗑️ RESET: Deleted ${orderResult.deletedCount} orders, ${ratingResult.deletedCount} ratings`);

    res.json({
      message: 'All order data has been cleared successfully',
      deleted: {
        orders: orderResult.deletedCount,
        ratings: ratingResult.deletedCount,
      },
      preserved: ['Products', 'Categories', 'Settings', 'Offers', 'User Accounts']
    });
  } catch (error) {
    console.error('Error resetting order data:', error);
    res.status(500).json({ message: 'Failed to reset data' });
  }
});

module.exports = router;
