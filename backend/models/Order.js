const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    shippingDetails: {
        fullName: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        pincode: String
    },
    paymentMethod: String,
    orderStatus: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered'],
        default: 'Confirmed'
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    totalAmount: {
        type: Number,
        required: true
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 