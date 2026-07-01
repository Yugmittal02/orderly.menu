const router = require('express').Router();
const { verifyToken, isCafeOwner } = require('../middleware/authMiddleware');
const {
  createCoupon, getMyCoupons, updateCoupon, deleteCoupon, toggleCoupon, validateCoupon
} = require('../controllers/couponController');

// Public — customer validates coupon
router.post('/validate', validateCoupon);

// Cafe Owner routes
router.post('/', verifyToken, isCafeOwner, createCoupon);
router.get('/', verifyToken, isCafeOwner, getMyCoupons);
router.put('/:id', verifyToken, isCafeOwner, updateCoupon);
router.delete('/:id', verifyToken, isCafeOwner, deleteCoupon);
router.patch('/:id/toggle', verifyToken, isCafeOwner, toggleCoupon);

module.exports = router;
