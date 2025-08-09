const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // React app's URL
    credentials: true
}));
app.use(express.json({ limit: '50mb' })); // Increase payload limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// MongoDB Connection with retry logic
const connectWithRetry = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/EduCycledb', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        console.log('Retrying in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    }
};

connectWithRetry();

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    college: { type: String, required: true },
    department: { type: String },
    year: { type: String },
    phone: { type: String },
    gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
    profileImage: { type: String },
    bio: { type: String },
    listings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    savedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

const User = mongoose.model('User', userSchema);

// Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    condition: { type: String, required: true },
    category: { type: String, required: true },
    images: [{ type: String }],
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Product = mongoose.model('Product', productSchema);

// Order Schema
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

// Routes
app.post('/api/signup', async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            college,
            department,
            year,
            phone,
            gender,
            profileImage,
            bio
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with all fields
        const user = new User({
            name,
            email,
            password: hashedPassword,
            college,
            department,
            year,
            phone,
            gender,
            profileImage,
            bio,
            listings: [],
            savedItems: []
        });

        await user.save();

        // Create token
        const token = jwt.sign({ userId: user._id }, 'educycle_secret_key_2024', { expiresIn: '1h' });

        // Return success response with token and user data
        res.status(201).json({
            token,
            userId: user._id,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                college: user.college,
                department: user.department,
                year: user.year,
                phone: user.phone,
                gender: user.gender,
                profileImage: user.profileImage,
                bio: user.bio,
                listings: user.listings,
                savedItems: user.savedItems
            },
            message: 'User registered successfully'
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            message: 'Error creating user',
            error: error.message
        });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Create token
        const token = jwt.sign({ userId: user._id }, 'educycle_secret_key_2024', { expiresIn: '1h' });

        // Return user data along with token
        res.json({
            token,
            userId: user._id,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                college: user.college,
                department: user.department,
                year: user.year,
                phone: user.phone,
                profileImage: user.profileImage,
                bio: user.bio,
                listings: user.listings,
                savedItems: user.savedItems
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// Product routes
app.post('/api/products', authenticateToken, async (req, res) => {
    try {
        const { name, description, price, condition, category, images } = req.body;

        const product = new Product({
            name,
            description,
            price,
            condition,
            category,
            images,
            seller: req.user.userId
        });

        await product.save();

        res.status(201).json({
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
});

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().populate('seller', 'name email');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

app.get('/api/products/user/:userId', authenticateToken, async (req, res) => {
    try {
        const products = await Product.find({ seller: req.user.userId });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user products', error: error.message });
    }
});

app.get('/api/products/saved', authenticateToken, async (req, res) => {
    try {
        const products = await Product.find({ savedBy: req.user.userId }).populate('seller', 'name email');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching saved products', error: error.message });
    }
});

app.post('/api/products/:productId/save', authenticateToken, async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if already saved
        const isSaved = product.savedBy.includes(req.user.userId);

        if (isSaved) {
            // Remove from saved
            product.savedBy = product.savedBy.filter(id => id.toString() !== req.user.userId);
        } else {
            // Add to saved
            product.savedBy.push(req.user.userId);
        }

        await product.save();

        res.json({
            message: isSaved ? 'Product removed from saved items' : 'Product saved successfully',
            isSaved: !isSaved
        });
    } catch (error) {
        res.status(500).json({ message: 'Error saving product', error: error.message });
    }
});

// Start server with error handling
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Server failed to start:', err);
    if (err.code === 'EADDRINUSE') {
        console.log('Port is busy, retrying in 5 seconds...');
        setTimeout(() => {
            app.listen(PORT);
        }, 5000);
    }
});

// Product detail route
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('seller', 'name email college');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
});

// Order routes
app.use('/api/orders', orderRoutes);