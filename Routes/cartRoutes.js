const express = require('express');
const router = express.Router();
const authenticateToken = require('../Middlewares/authMiddleware');
const {
    getCart,
    addProductToCart,
    updateCart,
    removeProductFromCart
} = require('../controllers/cartController');

// Route to get user's cart
router.get('/users-cart', authenticateToken, getCart);

// Route to add a product to the cart
router.post('/addcart/:id', authenticateToken, addProductToCart);

// Route to update product quantity in the cart
router.put('/update', authenticateToken, updateCart);

// Route to remove a product from the cart
router.delete('/remove/:productId', authenticateToken, removeProductFromCart);

module.exports = router;
