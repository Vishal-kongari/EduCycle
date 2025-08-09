import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUpload from './ImageUpload';
import './SellItem.css';

const SellItem = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        condition: '',
        category: '',
        images: []
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImagesSelected = async (files) => {
        try {
            const imagePromises = files.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.onerror = (e) => reject(e);
                    reader.readAsDataURL(file);
                });
            });

            const base64Images = await Promise.all(imagePromises);
            setFormData(prev => ({
                ...prev,
                images: base64Images
            }));
        } catch (err) {
            setError('Error processing images. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setSuccess('');

        try {
            // Validate form data
            if (!formData.name || !formData.description || !formData.price ||
                !formData.condition || !formData.category || formData.images.length === 0) {
                throw new Error('Please fill in all fields and upload at least one image');
            }

            // Get user info from localStorage
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo) {
                navigate('/login');
                return;
            }

            // Get existing products from localStorage
            const existingProducts = JSON.parse(localStorage.getItem('educycle_products') || '[]');

            // Create new product
            const newProduct = {
                _id: Date.now().toString(),
                ...formData,
                price: parseFloat(formData.price),
                seller: {
                    _id: userInfo._id,
                    name: userInfo.name,
                    email: userInfo.email,
                    college: userInfo.college,
                    department: userInfo.department,
                    year: userInfo.year
                },
                savedBy: [],
                status: 'available',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Add to products array
            existingProducts.push(newProduct);
            localStorage.setItem('educycle_products', JSON.stringify(existingProducts));

            // Update user's listings
            const users = JSON.parse(localStorage.getItem('educycle_users') || '[]');
            const userIndex = users.findIndex(u => u._id === userInfo._id);
            if (userIndex !== -1) {
                users[userIndex].listings = [...(users[userIndex].listings || []), newProduct._id];
                localStorage.setItem('educycle_users', JSON.stringify(users));
            }

            // Update userInfo in localStorage
            userInfo.listings = [...(userInfo.listings || []), newProduct._id];
            localStorage.setItem('userInfo', JSON.stringify(userInfo));

            setSuccess('Product listed successfully!');

            // Navigate back to dashboard after delay
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sell-item-container">
            <form onSubmit={handleSubmit} className="sell-item-form">
                <div className="sell-item-header">
                    <h2>Sell Your Item</h2>
                    <p>Fill in the details below to list your item for sale</p>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <div className="form-section">
                    <div className="form-group">
                        <label htmlFor="name">Item Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter item name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe your item"
                            rows="4"
                            required
                        />
                    </div>
                </div>

                <div className="form-section">
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="category-select"
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Textbooks">Textbooks</option>
                            <option value="Electronics">Electronics</option>

                            <option value="Lab Equipment">Lab Equipment</option>
                            <option value="Notes">Notes</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="condition">Condition</label>
                        <select
                            id="condition"
                            name="condition"
                            value={formData.condition}
                            onChange={handleInputChange}
                            className="category-select"
                            required
                        >
                            <option value="">Select Condition</option>
                            <option value="New">New</option>
                            <option value="Like New">Like New</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                        </select>
                    </div>
                </div>

                <div className="form-section">
                    <div className="form-group">
                        <label htmlFor="price">Price (₹)</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="Enter price"
                            min="0"
                            required
                        />
                    </div>
                </div>

                <div className="form-section">
                    <div className="form-group">
                        <label>Upload Images</label>
                        <ImageUpload onImagesSelected={handleImagesSelected} />
                        <p className="image-hint">Upload clear images of your item (Max 5 images)</p>
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Listing Item...' : 'List Item'}
                    </button>
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => navigate('/dashboard')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SellItem; 