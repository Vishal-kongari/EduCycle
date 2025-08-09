import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from './utils/api';
import Chat from './components/Chat';
import './ProductDetail.css';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showChat, setShowChat] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const { data } = await getProductById(id);
                setProduct(data);

                // Get current user from localStorage
                const userInfoStr = localStorage.getItem('userInfo');
                if (userInfoStr) {
                    const userInfo = JSON.parse(userInfoStr);
                    setCurrentUser(userInfo);
                }
            } catch (err) {
                setError('Failed to load product details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleBuyNow = () => {
        if (!currentUser) {
            alert('Please log in to purchase items');
            navigate('/login');
            return;
        }
        navigate('/checkout', { state: { product } });
    };

    const handleChatWithSeller = () => {
        if (!currentUser) {
            alert('Please log in to chat with the seller');
            navigate('/login');
            return;
        }
        setShowChat(true);
    };

    if (loading) {
        return <div className="loading">Loading product details...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!product) {
        return <div className="error">Product not found</div>;
    }

    return (
        <div className="product-detail-container">
            <button className="back-button" onClick={() => navigate(-1)}>
                &larr; Back to Marketplace
            </button>

            {showChat ? (
                <div className="chat-section">
                    <Chat
                        productId={product._id}
                        sellerId={product.seller._id}
                        currentUserId={currentUser?._id}
                        onClose={() => setShowChat(false)}
                    />
                </div>
            ) : (
                <div className="product-detail-card">
                    <div className="product-images">
                        {product.images && product.images.length > 0 ? (
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="main-image"
                            />
                        ) : (
                            <img src="https://via.placeholder.com/400x300?text=No+Image" alt="Product" />
                        )}
                    </div>

                    <div className="product-info">
                        <h1>{product.name}</h1>
                        <p className="price">{product.price}</p>
                        <p className="condition">Condition: {product.condition}</p>
                        <p className="category">Category: {product.category}</p>
                        <p className="description">{product.description}</p>

                        <div className="seller-info">
                            <h3>Seller Information</h3>
                            <p>Name: {product.seller?.name || 'User'}</p>
                            <p>College: {product.seller?.college || 'Not specified'}</p>
                            <p>Department: {product.seller?.department || 'Not specified'}</p>
                            <p>Year: {product.seller?.year || 'Not specified'}</p>
                        </div>

                        <div className="action-buttons">
                            <button className="buy-now-btn" onClick={handleBuyNow}>
                                Buy Now
                            </button>
                            <button className="chat-btn" onClick={handleChatWithSeller}>
                                Chat with Seller
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductDetail;