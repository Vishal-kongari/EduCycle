import React, { useState } from 'react';
import './Dashboard.css';

const dummyItems = [
  { id: 1, name: 'Engineering Drawing Kit', price: '₹250', image: 'https://via.placeholder.com/200x150/111111/00ffcc?text=Drawing+Kit' },
  { id: 2, name: 'Physics Textbook', price: '₹150', image: 'https://via.placeholder.com/200x150/111111/00ffcc?text=Physics+Book' },
  { id: 3, name: 'Scientific Calculator', price: '₹300', image: 'https://via.placeholder.com/200x150/111111/00ffcc?text=Calculator' },
  { id: 4, name: 'Notebook Set', price: '₹120', image: 'https://via.placeholder.com/200x150/111111/00ffcc?text=Notebooks' },
  { id: 5, name: 'Pen & Pencil Kit', price: '₹80', image: 'https://via.placeholder.com/200x150/111111/00ffcc?text=Pen+Kit' },
  { id: 6, name: 'Chemistry Lab Coat', price: '₹400', image: 'https://via.placeholder.com/200x150/111111/00ffcc?text=Lab+Coat' },
  { id: 7, name: 'Graph Paper Bundle', price: '₹60', image: 'https://via.placeholder.com/200x150/111111/00ffcc?text=Graph+Papers' },
  { id: 8, name: 'Used Laptop Stand', price: '₹500', image: 'https://via.placeholder.com/200x150/111111/00ffcc?text=Laptop+Stand' }
];

function Dashboard() {
  const [search, setSearch] = useState('');

  const filteredItems = dummyItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
  <h1 className="dashboard-title">Give it a Second Life 💫</h1>
  <p className="dashboard-subtitle">Reuse. Recycle. Relearn. | Powered by EduCycle</p>
  <hr className="glow-divider" />
</div>


      <input
        type="text"
        className="search-bar"
        placeholder="🔍 Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="items-grid">
        {filteredItems.map(item => (
          <div key={item.id} className="item-card">
            <img src={item.image} alt={item.name} className="item-img" />
            <h3>{item.name}</h3>
            <p>{item.price}</p>
            <button className="buy-btn">Buy Now</button>
          </div>
        ))}
      </div>

      <div className="sell-section">
        <h2>Want to sell something?</h2>
        <button className="sell-btn">List an Item</button>
      </div>
    </div>
  );
}

export default Dashboard;
