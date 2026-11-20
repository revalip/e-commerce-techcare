const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Semua endpoint admin terlindungi role admin
router.use(requireAdmin);

// Dashboard overview stats
router.get('/overview', adminController.getOverview);

// Orders management
router.get('/orders', adminController.getOrders);
router.post('/orders/:id/verify', adminController.verifyPayment);
router.put('/orders/:id/status', adminController.updateOrderStatus);

// Products management
router.post('/products', upload.single('image'), adminController.createProduct);
router.put('/products/:id', upload.single('image'), adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// Categories / Collections management
router.post('/collections', adminController.createCollection);
router.put('/collections/:id', adminController.updateCollection);
router.delete('/collections/:id', adminController.deleteCollection);

// Users & Roles management
router.get('/users', adminController.getUsers);
router.put('/users/:id/role', adminController.updateUserRole);

module.exports = router;
