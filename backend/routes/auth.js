const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateCustomer, validateAdminLogin } = require('../middleware/validation');
const { verifyToken } = require('../middleware/authMiddleware');

// Customer registration (session-based)
router.post('/customer', validateCustomer, authController.registerCustomer);

// Admin login
router.post('/admin/login', validateAdminLogin, authController.adminLogin);

// Profile
router.get('/profile', verifyToken, authController.getProfile);

// Cart sync
router.put('/cart', verifyToken, authController.syncCart);
router.get('/cart', verifyToken, authController.getCart);

// Activity log
router.post('/activity', verifyToken, authController.logActivity);
router.get('/activity', verifyToken, authController.getActivity);

module.exports = router;
