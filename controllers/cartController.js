const Cart = require('../Models/Cart');
const Product = require('../Models/Product');
const User = require('../Models/usermode');

// Get user's cart
const getCart = async (req, res) => {
    try {
        const userId = req.userID;
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const addProductToCart = async (req, res) => {
    try {
        const userId = req.userID;
        const productId = req.params.id;

        console.log('Product ID:', productId); // Log the productId for debugging

        // Query the product using productId (UUID)
        const product = await Product.findOne({ productId });
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Find the user's cart, if it exists
        let cart = await Cart.findOne({ user: userId });

        // If no cart exists, create a new one
        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [{ product: product._id, quantity: 1 }]
            });
            await cart.save();
            return res.status(200).json({ message: 'Product added to cart', cart });
        }

        // If the cart exists, check if the product is already in the cart
        const productIndex = cart.items.findIndex(item => item.product.toString() === product._id.toString());
        if (productIndex === -1) {
            // Product not found in cart, add it
            cart.items.push({ product: product._id, quantity: 1 });
        } else {
            // Product found, update quantity (if needed)
            cart.items[productIndex].quantity += 1;
        }

        // Save the updated cart
        await cart.save();
        res.status(200).json({ message: 'Product added to cart', cart });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Update product quantity in the cart
const updateCart = async (req, res) => {
    try {
        const userId = req.userID;
        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const productIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (productIndex > -1) {
            cart.items[productIndex].quantity = quantity;
            await cart.save();
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: 'Product not found in cart' });
        }
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Remove a product from the cart
const removeProductFromCart = async (req, res) => {
    try {
        const userId = req.userID;
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getCart,
    addProductToCart,
    updateCart,
    removeProductFromCart
};
