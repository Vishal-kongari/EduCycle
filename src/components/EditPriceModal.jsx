import React, { useState } from 'react';
import './EditPriceModal.css';

const EditPriceModal = ({ item, onClose, onSave }) => {
    const [newPrice, setNewPrice] = useState(item.price);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newPrice || newPrice <= 0) {
            setError('Please enter a valid price');
            return;
        }
        onSave(item._id, newPrice);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit Price</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="price">New Price (₹)</label>
                        <div className="price-input">
                            <input
                                type="number"
                                id="price"
                                value={newPrice}
                                onChange={(e) => setNewPrice(Number(e.target.value))}
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="save-btn">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPriceModal; 