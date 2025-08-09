const Product = require('../models/Product');
const User = require('../models/User');

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('seller', 'name email college department year')
            .sort('-createdAt');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('seller', 'name email college department year');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new product
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, condition, category, images } = req.body;
        const userId = req.user._id; // Assuming user is authenticated

        const product = new Product({
            name,
            description,
            price,
            condition,
            category,
            images,
            seller: userId
        });

        const savedProduct = await product.save();

        // Update user's listings
        await User.findByIdAndUpdate(userId, {
            $push: { listings: savedProduct._id }
        });

        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user is the seller
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this product' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );

        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user is the seller
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }

        await product.remove();

        // Remove product from user's listings and saved items
        await User.updateMany(
            {
                $or: [
                    { listings: product._id },
                    { savedItems: product._id }
                ]
            },
            {
                $pull: {
                    listings: product._id,
                    savedItems: product._id
                }
            }
        );

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Toggle save product
exports.toggleSaveProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.user._id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isSaved = product.savedBy.includes(userId);

        if (isSaved) {
            // Remove from saved items
            await Product.findByIdAndUpdate(productId, {
                $pull: { savedBy: userId }
            });
            await User.findByIdAndUpdate(userId, {
                $pull: { savedItems: productId }
            });
        } else {
            // Add to saved items
            await Product.findByIdAndUpdate(productId, {
                $push: { savedBy: userId }
            });
            await User.findByIdAndUpdate(userId, {
                $push: { savedItems: productId }
            });
        }

        const updatedProduct = await Product.findById(productId)
            .populate('seller', 'name email college department year');

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user's listings
exports.getUserListings = async (req, res) => {
    try {
        const userId = req.params.userId || req.user._id;
        const products = await Product.find({ seller: userId })
            .populate('seller', 'name email college department year')
            .sort('-createdAt');

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user's saved items
exports.getUserSavedItems = async (req, res) => {
    try {
        const userId = req.params.userId || req.user._id;
        const products = await Product.find({ savedBy: userId })
            .populate('seller', 'name email college department year')
            .sort('-createdAt');

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search products
exports.searchProducts = async (req, res) => {
    try {
        const { query, category } = req.query;
        let searchQuery = {};

        if (query) {
            searchQuery.$text = { $search: query };
        }

        if (category) {
            searchQuery.category = category;
        }

        const products = await Product.find(searchQuery)
            .populate('seller', 'name email college department year')
            .sort('-createdAt');

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 