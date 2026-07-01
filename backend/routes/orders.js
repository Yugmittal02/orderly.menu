const router = require('express').Router();
const { verifyToken, isCafeOwner } = require('../middleware/authMiddleware');
const {
  placeOrder, trackOrder, getCafeOrders,
  updateOrderStatus, getCafeStats, markOrderPaid
} = require('../controllers/tableOrderController');

// Public routes (customer — no auth)
router.post('/', placeOrder);
router.get('/track/:orderNumber', trackOrder);

// Cafe Owner routes
router.get('/cafe/stats', verifyToken, isCafeOwner, getCafeStats);  // must be before /:id
router.get('/cafe', verifyToken, isCafeOwner, getCafeOrders);
router.put('/:id/status', verifyToken, isCafeOwner, updateOrderStatus);
router.patch('/:id/payment', verifyToken, isCafeOwner, markOrderPaid); // NEW: mark payment received

module.exports = router;
