import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, getUserById, initializeDummyData, debugLocalStorage } from './utils/api';
import Chat from './components/Chat';
import './productdetials.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        // Initialize dummy data to ensure it's available
        initializeDummyData();

        // Debug localStorage
        const { products } = debugLocalStorage();
        console.log('Product ID from URL:', id);
        console.log('Looking for product with ID:', id);
        console.log('Available product IDs:', products.map(p => p._id));

        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const productData = await getProductById(id);
                console.log('Product data found:', productData);
                setProduct(productData);

                // Only fetch seller data if we have a seller ID
                if (productData.seller?._id) {
                    const sellerData = await getUserById(productData.seller._id);
                    console.log('Seller data found:', sellerData);
                    setSeller(sellerData);
                }
            } catch (error) {
                console.error('Error fetching product details:', error);
                setError(error.message || 'Failed to load product details');
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetails();
    }, [id]);

    const handleContactSeller = () => {
        setShowChat(true);
    };

    const handleCloseChat = () => {
        setShowChat(false);
    };

    const handleImageClick = (index) => {
        setCurrentImageIndex(index);
    };

    if (loading) {
        return <div className="loading">Loading product details...</div>;
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error">{error}</div>
                <button
                    className="retry-button"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!product) {
        return <div className="error">Product not found</div>;
    }

    return (
        <div className="product-details-container">
            <div className="product-details-content">
                <div className="product-images-section">
                    <div className="main-image">
                        <img
                            src={product.images?.[currentImageIndex] || '/placeholder-image.png'}
                            alt={product.title}
                            className="product-image"
                        />
                    </div>
                    {product.images && product.images.length > 0 && (
                        <div className="thumbnail-container">
                            {product.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`${product.title} thumbnail ${index + 1}`}
                                    className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                                    onClick={() => handleImageClick(index)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="product-info-section">
                    <h1 className="product-title">{product.title}</h1>
                    <div className="product-price">{product.price}</div>

                    <div className="product-description">
                        <h2>Description</h2>
                        <p>{product.description}</p>
                    </div>

                    <div className="product-details">
                        <h2>Details</h2>
                        <ul>
                            <li><strong>Condition:</strong> {product.condition}</li>
                            <li><strong>Category:</strong> {product.category}</li>
                            <li><strong>Location:</strong> {product.location}</li>
                            <li><strong>Posted:</strong> {new Date(product.createdAt).toLocaleDateString()}</li>
                        </ul>
                    </div>

                    {seller && (
                        <div className="seller-info">
                            <h2>Seller Information</h2>
                            <div className="seller-details">
                                <img
                                    src={seller.profileImage || '/default-avatar.png'}
                                    alt={seller.name}
                                    className="seller-avatar"
                                />
                                <div className="seller-text">
                                    <h3>{seller.name}</h3>
                                    <p>Member since {new Date(seller.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <button
                                className="contact-seller-btn"
                                onClick={handleContactSeller}
                            >
                                Contact Seller
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showChat && product.seller?._id && (
                <div className="chat-modal">
                    <div className="chat-modal-content">
                        <Chat
                            productId={product._id}
                            sellerId={product.seller._id}
                            currentUserId={localStorage.getItem('userId')}
                            onClose={handleCloseChat}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails; 