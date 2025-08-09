const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    condition: {
        type: String,
        required: true,
        enum: ['New', 'Like New', 'Good', 'Fair', 'Poor']
    },
    category: {
        type: String,
        required: true,
        enum: ['Textbooks', 'Electronics', 'Furniture', 'Lab Equipment', 'Notes', 'Other']
    },
    images: [{
        type: String, // URLs to images stored in cloud storage
        required: true
    }],
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    savedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['available', 'sold', 'reserved'],
        default: 'available'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add text index for search functionality
productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema); 