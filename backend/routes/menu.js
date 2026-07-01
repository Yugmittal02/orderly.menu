const router = require('express').Router();
const { verifyToken, isCafeOwner } = require('../middleware/authMiddleware');
const {
  getMenuByCafe, getMyMenu, addMenuItem, updateMenuItem,
  deleteMenuItem, toggleAvailability, getCategories
} = require('../controllers/menuController');

// Public routes
router.get('/cafe/:cafeId', getMenuByCafe);
router.get('/cafe/:cafeId/categories', getCategories);

// Cafe Owner routes
router.get('/my', verifyToken, isCafeOwner, getMyMenu);
router.post('/', verifyToken, isCafeOwner, addMenuItem);
router.put('/:id', verifyToken, isCafeOwner, updateMenuItem);
router.delete('/:id', verifyToken, isCafeOwner, deleteMenuItem);
router.patch('/:id/toggle', verifyToken, isCafeOwner, toggleAvailability);

module.exports = router;
