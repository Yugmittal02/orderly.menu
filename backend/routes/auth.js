const router = require('express').Router();
const { superAdminLogin, cafeOwnerLogin } = require('../controllers/authController');

// SuperAdmin login
router.post('/superadmin/login', superAdminLogin);

// Cafe Owner login
router.post('/cafe/login', cafeOwnerLogin);

module.exports = router;
