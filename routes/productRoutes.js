const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleSaveProduct,
    getUserListings,
    getUserSavedItems,
    searchProducts
} = require('../controllers/productController');

// Public routes
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);

// Protected routes (require authentication)
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.post('/:id/toggle-save', protect, toggleSaveProduct);
router.get('/user/listings', protect, getUserListings);
router.get('/user/saved', protect, getUserSavedItems);

module.exports = router; 