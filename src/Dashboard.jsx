import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EditPriceModal from './components/EditPriceModal';
import {
  getProducts,
  getUserProfile,
  updateUserProfile,
  toggleSaveProduct,
  getUserListings,
  getUserSavedItems,
  deleteProduct,
  updateProductPrice,
  clearAllData
} from './utils/api';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('marketplace');
  const [products, setProducts] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [orderProducts, setOrderProducts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Get user info from localStorage
        const userInfoStr = localStorage.getItem('userInfo');
        if (!userInfoStr) {
          navigate('/');
          return;
        }
        const userInfo = JSON.parse(userInfoStr);
        setUser(userInfo);
        setEditedUser(userInfo);

        // Fetch user profile
        const { data: userProfile } = await getUserProfile();
        setUser(userProfile);
        setEditedUser(userProfile);

        // Fetch all products
        const { data: allProducts } = await getProducts();
        setProducts(allProducts);

        // Fetch user's saved items and listings
        const { data: savedItems } = await getUserSavedItems(userInfo._id);
        setSavedItems(savedItems);

        const { data: userListings } = await getUserListings(userInfo._id);
        setMyListings(userListings);

        fetchUserOrders();
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Fetch product details for orders with only product ID
  useEffect(() => {
    if (userOrders.length > 0) {
      userOrders.forEach(order => {
        if (order.product && typeof order.product === 'string' && !orderProducts[order.product]) {
          fetchProductDetails(order.product);
        }
        // If MongoDB returns as { $oid: ... }
        if (order.product && order.product.$oid && !orderProducts[order.product.$oid]) {
          fetchProductDetails(order.product.$oid);
        }
      });
    }
    // eslint-disable-next-line
  }, [userOrders]);

  const fetchProductDetails = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setOrderProducts(prev => ({ ...prev, [productId]: data }));
      }
    } catch (err) {
      // Ignore errors for now
    }
  };

  const filteredItems = products.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSaveItem = async (item) => {
    try {
      const { data: updatedProduct } = await toggleSaveProduct(item._id, user._id);

      // Update products list
      setProducts(products.map(p =>
        p._id === updatedProduct._id ? updatedProduct : p
      ));

      // Update saved items list
      if (updatedProduct.savedBy.includes(user._id)) {
        setSavedItems([...savedItems, updatedProduct]);
      } else {
        setSavedItems(savedItems.filter(savedItem => savedItem._id !== item._id));
      }
    } catch (err) {
      console.error('Error toggling save item:', err);
      setError('Failed to save item. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const handleSellItem = () => {
    navigate('/sell');
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedUser(user);
    setSaveError('');
    setSaveSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value
    });
  };

  const handleSaveProfile = async () => {
    try {
      setSaveError('');
      setSaveSuccess('');

      // Validate required fields
      if (!editedUser.name || !editedUser.email || !editedUser.college) {
        setSaveError('Name, email, and college are required fields');
        return;
      }

      // Call API to update profile
      const { data } = await updateUserProfile(editedUser);
      setUser(data);
      setEditedUser(data);
      setIsEditing(false);
      setSaveSuccess('Profile updated successfully!');

      // Update localStorage with new user info
      localStorage.setItem('userInfo', JSON.stringify(data));

      // Refresh profile data
      await refreshProfileData();
    } catch (err) {
      console.error('Error updating profile:', err);
      setSaveError('Failed to update profile. Please try again.');
    }
  };

  const refreshProfileData = async () => {
    try {
      setProfileLoading(true);
      setProfileError('');
      const { data: userProfile } = await getUserProfile();
      setUser(userProfile);
      setEditedUser(userProfile);
    } catch (err) {
      console.error('Error refreshing profile:', err);
      setProfileError('Failed to refresh profile data.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleEditPrice = (item) => {
    setEditingItem(item);
  };

  const handleSavePrice = async (itemId, newPrice) => {
    try {
      // Update the price in the database
      const updatedProduct = await updateProductPrice(itemId, newPrice);

      // Update the listings in state
      setMyListings(myListings.map(item =>
        item._id === itemId ? { ...item, price: newPrice } : item
      ));

      // Update the products list if the item exists there
      setProducts(products.map(item =>
        item._id === itemId ? { ...item, price: newPrice } : item
      ));

      // Close the modal
      setEditingItem(null);
    } catch (err) {
      console.error('Error updating price:', err);
      setError('Failed to update price. Please try again.');
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      if (window.confirm('Are you sure you want to delete this item?')) {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo._id) {
          throw new Error('User not authenticated');
        }

        await deleteProduct(id, userInfo._id);

        // Remove the item from listings
        setMyListings(myListings.filter(item => item._id !== id));

        // Remove the item from products list if it exists there
        setProducts(products.filter(item => item._id !== id));

        // Remove from saved items if it exists there
        setSavedItems(savedItems.filter(item => item._id !== id));
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item. Please try again.');
    }
  };

  const handleClearDatabase = async () => {
    try {
      if (window.confirm('This will reset the database to initial dummy data. Are you sure?')) {
        await clearAllData();
        localStorage.removeItem('userInfo');
        navigate('/');
      }
    } catch (err) {
      console.error('Error resetting database:', err);
      setError('Failed to reset database. Please try again.');
    }
  };

  // Fetch user orders from backend
  const fetchUserOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError('');
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch('http://localhost:5000/api/orders/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch orders');
      }
      const data = await response.json();
      setUserOrders(data);
    } catch (error) {
      setOrdersError(error.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Helper for formatting date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderProfile = () => {
    if (profileLoading) {
      return <div className="loading">Loading profile data...</div>;
    }

    if (profileError) {
      return (
        <div className="error-container">
          <div className="error">{profileError}</div>
          <button className="retry-btn" onClick={refreshProfileData}>
            Retry
          </button>
        </div>
      );
    }

    if (!user) {
      return <div className="error">Failed to load profile. Please try again later.</div>;
    }

    return (
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-image">
            <img
              src={user.profileImage || 'https://via.placeholder.com/150/111111/00ffcc?text=Profile'}
              alt={user.name || 'Profile'}
            />
            {isEditing && (
              <div className="profile-image-edit">
                <label htmlFor="profileImage">Change Picture</label>
                <input
                  type="text"
                  id="profileImage"
                  name="profileImage"
                  value={editedUser.profileImage || ''}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                />
              </div>
            )}
          </div>
          <div className="profile-info">
            {isEditing ? (
              <>
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editedUser.name || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editedUser.email || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="college">College *</label>
                  <input
                    type="text"
                    id="college"
                    name="college"
                    value={editedUser.college || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={editedUser.department || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="year">Year</label>
                  <select
                    id="year"
                    name="year"
                    value={editedUser.year || ''}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={editedUser.phone || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={editedUser.bio || ''}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
                {saveError && <div className="error-message">{saveError}</div>}
                {saveSuccess && <div className="success-message">{saveSuccess}</div>}
                <div className="profile-actions">
                  <button className="save-btn" onClick={handleSaveProfile}>Save Changes</button>
                  <button className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h2>{user.name || 'User'}</h2>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>College:</strong> {user.college}</p>
                {user.department && <p><strong>Department:</strong> {user.department}</p>}
                {user.year && <p><strong>Year:</strong> {user.year}</p>}
                {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
                {user.bio && <p className="bio"><strong>Bio:</strong> {user.bio}</p>}
                <button className="edit-btn" onClick={handleEditProfile}>Edit Profile</button>
              </>
            )}
          </div>
        </div>
        <div className="profile-stats">
          <div className="stat">
            <h3>{myListings.length}</h3>
            <p>Listings</p>
          </div>
          <div className="stat">
            <h3>{savedItems.length}</h3>
            <p>Saved Items</p>
          </div>
        </div>
        <div className="admin-actions">
          <button
            className="clear-database-btn"
            onClick={handleClearDatabase}
            style={{
              backgroundColor: '#ff4444',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              marginTop: '20px',
              cursor: 'pointer'
            }}
          >
            Clear Listings
          </button>
        </div>
        {/* Your Orders Section below profile */}
        <div className="orders-section profile-card">
          <h2>Your Orders</h2>
          {ordersLoading ? (
            <p className="no-orders">Loading orders...</p>
          ) : ordersError ? (
            <p className="no-orders">{ordersError}</p>
          ) : userOrders.length === 0 ? (
            <p className="no-orders">No orders found</p>
          ) : (
            <div className="orders-listings">
              {userOrders.map(order => {
                let productId = '';
                if (order.product && typeof order.product === 'string') productId = order.product;
                if (order.product && order.product.$oid) productId = order.product.$oid;
                const product = order.product && order.product.name ? order.product : orderProducts[productId];
                return (
                  <div key={order._id} className="profile-order-card">
                    <div className="profile-order-image">
                      <img src={product && product.images && product.images[0]
                        ? product.images[0]
                        : 'https://via.placeholder.com/200x150/111111/00ffcc?text=No+Image'} alt={product && product.name ? product.name : 'Product'} />
                    </div>
                    <div className="profile-order-details">
                      <h3>{product && product.name ? product.name : `Product ID: ${productId}`}</h3>
                      <p className="price">₹{order.totalAmount}</p>
                      <p className="order-id">Order #{order.orderId || order._id.slice(-6).toUpperCase()}</p>
                      <span className={`status-badge ${order.orderStatus ? order.orderStatus.toLowerCase() : 'confirmed'}`}>{order.orderStatus || 'Confirmed'}</span>
                      <p className="order-date">{formatDate(order.orderDate)}</p>
                      {order.shippingDetails && (
                        <p className="shipping-address">
                          {order.shippingDetails.address}, {order.shippingDetails.city}, {order.shippingDetails.state} {order.shippingDetails.pincode}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    if (error) {
      return <div className="error">{error}</div>;
    }

    switch (activeTab) {
      case 'marketplace':
        return (
          <div className="items-grid">
            {filteredItems.map(item => (
              <div
                key={item._id}
                className="item-card"
                onClick={() => navigate(`/product/${item._id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="item-image">
                  <img src={item.images && item.images[0] ? item.images[0] : 'https://via.placeholder.com/200x150/111111/00ffcc?text=No+Image'} alt={item.name} />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="price">{item.price}</p>
                  <p className="condition">{item.condition}</p>
                  <div className="item-actions">
                    <button
                      className={`save-btn ${item.savedBy.includes(user._id) ? 'saved' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveItem(item);
                      }}
                    >
                      {item.savedBy.includes(user._id) ? 'Saved' : 'Save'}
                    </button>
                    <button
                      className="chat-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${item._id}`, { state: { showChat: true } });
                      }}
                    >
                      Chat with Seller
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'saved':
        return (
          <div className="items-grid">
            {savedItems.length > 0 ? (
              savedItems.map(item => (
                <div
                  key={item._id}
                  className="item-card"
                  onClick={() => navigate(`/product/${item._id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="item-image">
                    <img src={item.images && item.images[0] ? item.images[0] : 'https://via.placeholder.com/200x150/111111/00ffcc?text=No+Image'} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="price">{item.price}</p>
                    <p className="condition">{item.condition}</p>
                    <div className="item-actions">
                      <button
                        className="save-btn saved"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveItem(item);
                        }}
                      >
                        Saved
                      </button>
                      <button
                        className="chat-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${item._id}`, { state: { showChat: true } });
                        }}
                      >
                        Chat with Seller
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>You haven't saved any items yet.</p>
              </div>
            )}
          </div>
        );
      case 'my-listings':
        return (
          <div className="items-grid">
            {myListings.length > 0 ? (
              myListings.map(item => (
                <div key={item._id} className="item-card">
                  <div className="item-image">
                    <img src={item.images && item.images[0] ? item.images[0] : 'https://via.placeholder.com/200x150/111111/00ffcc?text=No+Image'} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="price">{item.price}</p>
                    <p className="condition">{item.condition}</p>
                    <div className="item-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEditPrice(item)}
                      >
                        Edit Price
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteItem(item._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>You haven't listed any items yet.</p>
                <button className="sell-btn" onClick={handleSellItem}>Sell an Item</button>
              </div>
            )}
            {editingItem && (
              <EditPriceModal
                item={editingItem}
                onClose={() => setEditingItem(null)}
                onSave={handleSavePrice}
              />
            )}
          </div>
        );
      case 'profile':
        return (
          <div className="profile-section">
            {renderProfile()}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo-container">
          <img src="logo.png" alt="EduCycle Logo" className="logo-img" />
          <span className="highlight">EduCycle</span>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="user-section">
          <div className="user-profile-header" onClick={() => setActiveTab('profile')}>
            <img
              src={user?.profileImage || 'https://via.placeholder.com/150/111111/00ffcc?text=Profile'}
              alt={user?.name || 'Profile'}
              className="user-profile-image"
            />
            <div className="user-profile-info">
              <span className="user-profile-name">{user?.name || 'User'}</span>
              <span className="user-profile-email">{user?.email || ''}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="sidebar">
          <button
            className={`tab-btn ${activeTab === 'marketplace' ? 'active' : ''}`}
            onClick={() => setActiveTab('marketplace')}
          >
            Marketplace
          </button>
          <button
            className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            Saved Items ({savedItems.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'my-listings' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-listings')}
          >
            My Listings ({myListings.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button className="sell-btn" onClick={handleSellItem}>
            Sell an Item
          </button>
        </div>

        <div className="main-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;