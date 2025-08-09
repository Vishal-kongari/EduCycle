const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    college: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true,
        min: 1,
        max: 4
    },
    profileImage: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        maxlength: 500
    },
    phone: {
        type: String,
        trim: true
    },
    listings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    savedItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

module.exports = mongoose.model('User', userSchema); 