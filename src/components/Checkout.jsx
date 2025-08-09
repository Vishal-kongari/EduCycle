import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import PaymentMethodSelector from './PaymentMethodSelector';
import './Checkout.css';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
    });

    const product = location.state?.product;

    if (!product) {
        return (
            <div className="checkout-container">
                <div className="error-message">
                    <h2>No product selected</h2>
                    <p>Please select a product to proceed with checkout.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="btn-primary"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Make sure we have a valid product ID
            if (!product || !product._id) {
                throw new Error('Invalid product information');
            }

            console.log('Product data:', product);
            console.log('Product ID:', product._id);

            const orderData = {
                product: product._id,
                shippingDetails: formData,
                paymentMethod,
                totalAmount: product.price
            };

            console.log('Sending order data:', orderData);

            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
                console.error('Server error response:', errorData);
                throw new Error(errorData.message || 'Failed to create order');
            }

            const order = await response.json();
            console.log('Order created successfully:', order);
            setCurrentStep(3);
        } catch (error) {
            console.error('Error placing order:', error);
            alert(error.message || 'Failed to place order. Please try again.');
        }
    };

    // Helper to load Razorpay script dynamically
    function loadRazorpayScript() {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    // Razorpay payment handler
    const handleRazorpayPayment = async () => {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }
        const options = {
            key: "rzp_test_2xErNEiREmqzwo",
            amount: product.price * 100, // Amount in paise
            currency: "INR",
            name: product.name,
            description: `Payment for ${product.name}`,
            image: product.images && product.images[0] ? product.images[0] : undefined,
            handler: function (response) {
                handleSubmitAfterPayment(response);
            },
            prefill: {
                name: formData.fullName,
                email: formData.email,
                contact: formData.phone,
            },
            theme: {
                color: "#3399cc",
            },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    // Place order after successful Razorpay payment
    const handleSubmitAfterPayment = async (razorpayResponse) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
            if (!product || !product._id) {
                throw new Error('Invalid product information');
            }
            const orderData = {
                product: product._id,
                shippingDetails: formData,
                paymentMethod,
                totalAmount: product.price,
                razorpayPaymentId: razorpayResponse.razorpay_payment_id,
            };
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
                throw new Error(errorData.message || 'Failed to create order');
            }
            setCurrentStep(3);
        } catch (error) {
            alert(error.message || 'Failed to place order. Please try again.');
        }
    };

    const returnToMarketplace = () => {
        navigate('/dashboard');
    };

    return (
        <div className="checkout-container">
            <button className="back-button" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <div className="checkout-progress">
                <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
                    <div className="step-icon">1</div>
                    <span>Shipping</span>
                </div>
                <div className="progress-line"></div>
                <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
                    <div className="step-icon">2</div>
                    <span>Payment</span>
                </div>
                <div className="progress-line"></div>
                <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
                    <div className="step-icon">3</div>
                    <span>Confirmation</span>
                </div>
            </div>

            <div className="checkout-content">
                {currentStep === 1 && (
                    <div className="checkout-form">
                        <h2>Shipping Information</h2>
                        <form onSubmit={() => setCurrentStep(2)}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="fullName">Full Name</label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="city">City</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="state">State</label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="pincode">Pincode</label>
                                    <input
                                        type="text"
                                        id="pincode"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="continue-button">
                                    Continue to Payment
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="checkout-form">
                        <h2>Payment Method</h2>
                        <form onSubmit={e => { e.preventDefault(); if (paymentMethod === "card") { handleRazorpayPayment(); } else { handleSubmit(e); } }}>
                            <PaymentMethodSelector
                                selectedMethod={paymentMethod}
                                onSelect={setPaymentMethod}
                            />
                            <div className="form-actions">
                                <button
                                    className="back-step-button"
                                    type="button"
                                    onClick={() => setCurrentStep(1)}
                                >
                                    Back
                                </button>
                                <button
                                    className="place-order-button"
                                    type="submit"
                                >
                                    Place Order
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="confirmation-section">
                        <div className="confirmation-icon">
                            <CheckCircle size={80} color="#00C9A7" />
                        </div>
                        <h2>Order Confirmed!</h2>
                        <p>
                            Thank you for your purchase. Your order has been received and will be processed soon.
                            A confirmation email has been sent to {formData.email}.
                        </p>
                        <div className="confirmation-details">
                            <div className="confirmation-detail">
                                <span className="detail-label">Order Number:</span>
                                <span className="detail-value">#{Math.floor(Math.random() * 100000)}</span>
                            </div>
                            <div className="confirmation-detail">
                                <span className="detail-label">Shipping Address:</span>
                                <span className="detail-value">
                                    {formData.address}, {formData.city}, {formData.state} {formData.pincode}
                                </span>
                            </div>
                        </div>
                        <button className="return-button" onClick={returnToMarketplace}>
                            Return to Marketplace
                        </button>
                    </div>
                )}

                <div className="checkout-summary">
                    <h2>Order Summary</h2>
                    <div className="order-item">
                        <div className="item-image">
                            <img src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/80x80?text=No+Image'} alt={product.name} />
                        </div>
                        <div className="item-details">
                            <h3>{product.name}</h3>
                            <p className="item-condition">Condition: {product.condition}</p>
                            <p className="item-price">₹{product.price}</p>
                        </div>
                    </div>
                    <div className="order-total">
                        <div className="total-row">
                            <span>Subtotal</span>
                            <span>₹{product.price}</span>
                        </div>
                        <div className="total-row">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="total-row grand-total">
                            <span>Total</span>
                            <span>₹{product.price}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout; 