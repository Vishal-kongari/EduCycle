const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    jwt.verify(token, 'educycle_secret_key_2024', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        req.user = user;
        next();
    });
};

// Create a new order
router.post('/', authenticateToken, async (req, res) => {
    try {
        console.log('Received order request:', req.body);
        console.log('User from token:', req.user);

        const { product, shippingDetails, paymentMethod, totalAmount } = req.body;

        if (!product || !shippingDetails || !paymentMethod || !totalAmount) {
            console.log('Missing required fields:', { product, shippingDetails, paymentMethod, totalAmount });
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Get the Order model from mongoose
        const Order = require('mongoose').model('Order');

        // Get the Product model
        const Product = require('mongoose').model('Product');

        // Get the User model
        const User = require('mongoose').model('User');

        // Check if the user exists
        const userExists = await User.findById(req.user.userId);
        if (!userExists) {
            console.log('User not found:', req.user.userId);
            return res.status(404).json({ message: 'User not found' });
        }

        let productId;

        // Check if the product ID is a simple string (like "1", "2", etc.)
        // This is likely a dummy product from localStorage
        if (/^\d+$/.test(product)) {
            console.log('Product ID is a simple string, creating a new product in the database');

            try {
                // Create a new product in the database
                const newProduct = new Product({
                    name: 'Product from localStorage',
                    description: 'This product was created from localStorage data',
                    price: totalAmount,
                    condition: 'Good',
                    category: 'Other',
                    images: ['https://via.placeholder.com/300x300?text=Product'],
                    seller: req.user.userId
                });

                await newProduct.save();
                productId = newProduct._id;
                console.log('Created new product with ID:', productId);
            } catch (productError) {
                console.error('Error creating new product:', productError);
                return res.status(500).json({
                    message: 'Error creating product for order',
                    error: productError.message
                });
            }
        } else {
            // Try to find the product in the database
            try {
                const productExists = await Product.findById(product);
                if (!productExists) {
                    console.log('Product not found:', product);
                    return res.status(404).json({ message: 'Product not found' });
                }
                productId = product;
            } catch (findError) {
                console.error('Error finding product:', findError);
                return res.status(500).json({
                    message: 'Error finding product',
                    error: findError.message
                });
            }
        }

        const orderId = 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();
        console.log('Creating order with ID:', orderId);

        const order = new Order({
            orderId,
            userId: req.user.userId,
            product: productId,
            shippingDetails,
            paymentMethod,
            totalAmount,
            orderStatus: 'Confirmed'
        });

        console.log('Order object created:', order);
        await order.save();
        console.log('Order saved successfully');
        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
});

// Get user's orders
router.get('/user', authenticateToken, async (req, res) => {
    try {
        // Get the Order model from mongoose
        const Order = require('mongoose').model('Order');

        const orders = await Order.find({ userId: req.user.userId })
            .populate('product')
            .sort({ orderDate: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

module.exports = router; 