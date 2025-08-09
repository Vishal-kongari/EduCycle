const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Create a new order
router.post('/', auth, async (req, res) => {
    try {
        const { product, shippingDetails, paymentMethod, totalAmount } = req.body;

        const orderId = 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();

        const order = new Order({
            orderId,
            userId: req.user.userId,
            product,
            shippingDetails,
            paymentMethod,
            totalAmount,
            orderStatus: 'Confirmed'
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
});

// Get user's orders
router.get('/user', auth, async (req, res) => {
    try {
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