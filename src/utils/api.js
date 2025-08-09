// API utility functions that use dummy data
import { dummyProducts, dummyUsers, getProductsByCategory, getProductsBySeller, getSavedProducts, getUserProfile as getDummyUserProfile } from '../dummyData';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize localStorage with dummy data if not already present
const initializeLocalStorage = () => {
    if (!localStorage.getItem('educycle_products')) {
        localStorage.setItem('educycle_products', JSON.stringify(dummyProducts));
    }
    if (!localStorage.getItem('educycle_users')) {
        localStorage.setItem('educycle_users', JSON.stringify(dummyUsers));
    }
};

// Call this function when the app starts
initializeLocalStorage();

// Function to explicitly initialize dummy data
export const initializeDummyData = () => {
    localStorage.setItem('educycle_products', JSON.stringify(dummyProducts));
    localStorage.setItem('educycle_users', JSON.stringify(dummyUsers));
    console.log('Dummy data initialized');
    return { success: true };
};

// Get all products
export const getProducts = async () => {
    await delay(500); // Simulate network delay
    const products = JSON.parse(localStorage.getItem('educycle_products') || '[]');
    return { data: products };
};

// Get product by ID
export const getProductById = async (id) => {
    await delay(300); // Simulate network delay
    // Always use localStorage for now
    const products = JSON.parse(localStorage.getItem('educycle_products') || '[]');
    const product = products.find(p => p._id === id);

    if (!product) {
        throw new Error('Product not found');
    }

    return { data: product };
};

// Get products by category
export const getProductsByCategoryAPI = async (category) => {
    await delay(400);
    const products = JSON.parse(localStorage.getItem('educycle_products') || '[]');
    const filteredProducts = products.filter(p => p.category === category);
    return { data: filteredProducts };
};

// Get products by seller
export const getProductsBySellerAPI = async (sellerId) => {
    await delay(400);
    const products = JSON.parse(localStorage.getItem('educycle_products') || '[]');
    const filteredProducts = products.filter(p => p.seller._id === sellerId);
    return { data: filteredProducts };
};

// Get saved products for a user
export const getSavedProductsAPI = async (userId) => {
    await delay(400);
    const products = JSON.parse(localStorage.getItem('educycle_products') || '[]');
    const filteredProducts = products.filter(p => p.savedBy.includes(userId));
    return { data: filteredProducts };
};

// Get user profile
export const getUserProfile = async () => {
    await delay(500);
    const userInfoStr = localStorage.getItem('userInfo');
    if (!userInfoStr) {
        throw new Error('User not found');
    }
    try {
        const userInfo = JSON.parse(userInfoStr);
        return { data: userInfo };
    } catch (err) {
        throw new Error('Invalid user data');
    }
};

// Get user's listings
export const getUserListings = async (userId) => {
    await delay(300);
    const products = JSON.parse(localStorage.getItem('educycle_products') || '[]');
    const listings = products.filter(product => product.seller._id === userId);
    return { data: listings };
};

// Get user's saved items
export const getUserSavedItems = async (userId) => {
    await delay(300);
    const products = JSON.parse(localStorage.getItem('educycle_products') || '[]');
    const savedItems = products.filter(product => product.savedBy.includes(userId));
    return { data: savedItems };
};

// Toggle save product
export const toggleSaveProduct = async (productId, userId) => {
    await delay(300);
    const products = JSON.parse(localStorage.getItem('educycle_products') || '[]');
    const productIndex = products.findIndex(p => p._id === productId);

    if (productIndex === -1) {
        throw new Error('Product not found');
    }

    const product = products[productIndex];

    // Toggle the saved status
    if (product.savedBy.includes(userId)) {
        product.savedBy = product.savedBy.filter(id => id !== userId);
    } else {
        product.savedBy.push(userId);
    }

    // Update the product in the array
    products[productIndex] = product;

    // Save to localStorage
    localStorage.setItem('educycle_products', JSON.stringify(products));

    // Update user's savedItems array
    const users = JSON.parse(localStorage.getItem('educycle_users') || '[]');
    const userIndex = users.findIndex(u => u._id === userId);

    if (userIndex !== -1) {
        const user = users[userIndex];
        if (product.savedBy.includes(userId)) {
            user.savedItems = [...(user.savedItems || []), productId];
        } else {
            user.savedItems = (user.savedItems || []).filter(id => id !== productId);
        }
        users[userIndex] = user;
        localStorage.setItem('educycle_users', JSON.stringify(users));
    }

    return { data: product };
};

// Delete product
export const deleteProduct = async (productId, userId) => {
    await delay(500);
    const products = JSON.parse(localStorage.getItem('educycle_products') || '[]');
    const productIndex = products.findIndex(p => p._id === productId);

    if (productIndex === -1) {
        throw new Error('Product not found');
    }

    const product = products[productIndex];
    if (product.seller._id !== userId) {
        throw new Error('Unauthorized to delete this product');
    }

    // Remove from products array
    products.splice(productIndex, 1);

    // Save to localStorage
    localStorage.setItem('educycle_products', JSON.stringify(products));

    // Update user's listings
    const users = JSON.parse(localStorage.getItem('educycle_users') || '[]');
    const userIndex = users.findIndex(u => u._id === userId);

    if (userIndex !== -1) {
        const user = users[userIndex];
        user.listings = (user.listings || []).filter(id => id !== productId);
        users[userIndex] = user;
        localStorage.setItem('educycle_users', JSON.stringify(users));
    }

    // Update localStorage userInfo
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (userInfo._id === userId) {
        userInfo.listings = (userInfo.listings || []).filter(id => id !== productId);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }

    return { success: true };
};

// Create new product
export const createProduct = async (productData) => {
    await delay(700);

    // Get current user info
    const userInfoStr = localStorage.getItem('userInfo');
    if (!userInfoStr) {
        throw new Error('User not authenticated');
    }
    const userInfo = JSON.parse(userInfoStr);

    // Get existing products
    const products = JSON.parse(localStorage.getItem('educycle_products') || '[]');

    // Generate a new ID
    const newId = (products.length + 1).toString();

    // Create a new product
    const newProduct = {
        _id: newId,
        ...productData,
        seller: {
            _id: userInfo._id,
            name: userInfo.name,
            email: userInfo.email,
            college: userInfo.college,
            department: userInfo.department,
            year: userInfo.year
        },
        createdAt: new Date().toISOString(),
        savedBy: []
    };

    // Add to products array
    products.push(newProduct);

    // Save to localStorage
    localStorage.setItem('educycle_products', JSON.stringify(products));

    // Update user's listings
    const users = JSON.parse(localStorage.getItem('educycle_users') || '[]');
    const userIndex = users.findIndex(u => u._id === userInfo._id);

    if (userIndex !== -1) {
        const user = users[userIndex];
        user.listings = [...(user.listings || []), newId];
        users[userIndex] = user;
        localStorage.setItem('educycle_users', JSON.stringify(users));
    }

    // Update localStorage userInfo
    userInfo.listings = [...(userInfo.listings || []), newId];
    localStorage.setItem('userInfo', JSON.stringify(userInfo));

    return { data: newProduct };
};

// Update product
export const updateProduct = async (productId, productData) => {
    await delay(600);
    const products = JSON.parse(localStorage.getItem('educycle_products') || '[]');
    const productIndex = products.findIndex(p => p._id === productId);

    if (productIndex === -1) {
        throw new Error('Product not found');
    }

    // Update the product
    products[productIndex] = {
        ...products[productIndex],
        ...productData
    };

    // Save to localStorage
    localStorage.setItem('educycle_products', JSON.stringify(products));

    return { data: products[productIndex] };
};

// Login user
export const loginUser = async (email, password) => {
    await delay(800);

    // In a real app, this would validate credentials
    // For our dummy data, we'll just find the user by email
    const users = JSON.parse(localStorage.getItem('educycle_users') || '[]');
    const user = users.find(u => u.email === email);

    if (!user) {
        throw new Error('Invalid credentials');
    }

    // In a real app, we would return a token
    return {
        data: {
            user,
            token: 'dummy-token-' + user._id
        }
    };
};

// Register user
export const registerUser = async (userData) => {
    await delay(1000);

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('educycle_users') || '[]');
    const existingUser = users.find(u => u.email === userData.email);

    if (existingUser) {
        throw new Error('User already exists');
    }

    // Generate a new ID
    const newId = 'user' + (users.length + 1);

    // Create a new user
    const newUser = {
        _id: newId,
        ...userData,
        profileImage: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 70) + 1}.jpg`,
        bio: `${userData.department} major at ${userData.college}.`,
        listings: [],
        savedItems: []
    };

    // Add to users array
    users.push(newUser);

    // Save to localStorage
    localStorage.setItem('educycle_users', JSON.stringify(users));

    return {
        data: {
            user: newUser,
            token: 'dummy-token-' + newUser._id
        }
    };
};

// Update user profile
export const updateUserProfile = async (userData) => {
    await delay(600);

    // Get the current user info
    const userInfoStr = localStorage.getItem('userInfo');
    if (!userInfoStr) {
        throw new Error('User not found');
    }

    try {
        // Create updated user object
        const updatedUser = {
            ...JSON.parse(userInfoStr),
            ...userData,
            // Preserve these fields as they shouldn't be updated through this function
            _id: JSON.parse(userInfoStr)._id,
            password: JSON.parse(userInfoStr).password,
            createdAt: JSON.parse(userInfoStr).createdAt
        };

        // Update localStorage
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));

        // Update in users array
        const users = JSON.parse(localStorage.getItem('educycle_users') || '[]');
        const userIndex = users.findIndex(u => u._id === updatedUser._id);

        if (userIndex !== -1) {
            users[userIndex] = {
                ...users[userIndex],
                ...userData,
                // Preserve these fields
                _id: users[userIndex]._id,
                password: users[userIndex].password,
                createdAt: users[userIndex].createdAt
            };
            localStorage.setItem('educycle_users', JSON.stringify(users));
        }

        return { data: updatedUser };
    } catch (err) {
        throw new Error('Failed to update profile');
    }
};

export const updateProductPrice = async (productId, newPrice) => {
    try {
        // Get existing products from localStorage
        const products = JSON.parse(localStorage.getItem('educycle_products') || '[]');

        // Find and update the product
        const updatedProducts = products.map(product => {
            if (product._id === productId) {
                return {
                    ...product,
                    price: newPrice,
                    updatedAt: new Date().toISOString()
                };
            }
            return product;
        });

        // Save back to localStorage
        localStorage.setItem('educycle_products', JSON.stringify(updatedProducts));

        // Return the updated product
        return updatedProducts.find(p => p._id === productId);
    } catch (error) {
        console.error('Error updating product price:', error);
        throw error;
    }
};

// Clear all data and reinitialize with dummy data
export const clearAllData = async () => {
    await delay(300);
    // Clear current data
    localStorage.removeItem('educycle_users');
    localStorage.removeItem('educycle_products');
    localStorage.removeItem('userInfo');

    // Reinitialize with dummy data
    localStorage.setItem('educycle_products', JSON.stringify(dummyProducts));
    localStorage.setItem('educycle_users', JSON.stringify(dummyUsers));

    return { success: true };
};

// Get user by ID
export const getUserById = async (id) => {
    // Always use localStorage for now
    const users = JSON.parse(localStorage.getItem('educycle_users') || '[]');
    const user = users.find(u => u._id === id);

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};

// Debug function to check localStorage
export const debugLocalStorage = () => {
    const products = JSON.parse(localStorage.getItem('educycle_products') || '[]');
    const users = JSON.parse(localStorage.getItem('educycle_users') || '[]');

    console.log('Products in localStorage:', products);
    console.log('Users in localStorage:', users);

    return {
        products,
        users
    };
};

// Get messages between two users for a specific product
export const getMessages = async (userId1, userId2, productId) => {
    await delay(300);

    // Get messages from localStorage or initialize empty array
    const messagesKey = `messages_${userId1}_${userId2}_${productId}`;
    const messages = JSON.parse(localStorage.getItem(messagesKey) || '[]');

    return messages;
};

// Send a message between two users for a specific product
export const sendMessage = async (messageData) => {
    await delay(300);

    const { senderId, receiverId, productId, content, timestamp } = messageData;

    // Create a unique key for this conversation
    const messagesKey = `messages_${senderId}_${receiverId}_${productId}`;

    // Get existing messages or initialize empty array
    const messages = JSON.parse(localStorage.getItem(messagesKey) || '[]');

    // Add the new message
    const newMessage = {
        _id: `msg_${Date.now()}`,
        ...messageData
    };

    messages.push(newMessage);

    // Save back to localStorage
    localStorage.setItem(messagesKey, JSON.stringify(messages));

    return { data: newMessage };
};