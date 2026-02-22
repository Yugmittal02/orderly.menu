const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', productController.getAllProducts);
router.delete('/all', verifyToken, isAdmin, productController.deleteAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', verifyToken, isAdmin, productController.createProduct);
router.put('/:id', verifyToken, isAdmin, productController.updateProduct);
router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);
router.patch('/:id/toggle-availability', verifyToken, isAdmin, productController.toggleAvailability);

module.exports = router;
