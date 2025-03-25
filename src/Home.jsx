import React from 'react'
import './Home.css'
import Login from './Login'

function Home() {
  return (
    <div className="home-container">
      {/* Navbar */}
      <header className="navbar">
        <div className="logo">EduCycle</div>
        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#contact">Contact</a>
          <a href="#login" style={{ cursor: 'pointer' }}>Sign In</a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="hero" id="home">
        <h1>
          Welcome to <span className="highlight">EduCycle</span>
        </h1>
        <p>
          Don’t Trash It, Just Cash It! A sustainable reselling platform for students, by students.
        </p>
        <a href="#login">
          <button className="explore-button">
            Explore Now
          </button>
        </a>
      </main>

      {/* Features Section */}
      <section className="features-section" id="features">
        <h2 className="section-title">Why to Choose EduCycle?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>1️⃣ Visit the Website</h3>
            <p>Head over to the EduCycle platform using your browser or mobile device.</p>
          </div>
          <div className="feature-card">
            <h3>2️⃣ Create Your Account</h3>
            <p>Sign up using your college email to get verified access to our platform.</p>
          </div>
          <div className="feature-card">
            <h3>3️⃣ Explore Listings</h3>
            <p>Browse through textbooks, electronics, and more posted by other students.</p>
          </div>
          <div className="feature-card">
            <h3>4️⃣ Post Your Items</h3>
            <p>Have old books or gadgets? List them for sale with easy upload options.</p>
          </div>
          <div className="feature-card">
            <h3>5️⃣ Chat with Buyers/Sellers</h3>
            <p>Use real-time messaging to discuss pricing, item condition, and meetups.</p>
          </div>
          <div className="feature-card">
            <h3>6️⃣ Make a Secure Payment</h3>
            <p>Buy with confidence using Razorpay’s secure payment gateway.</p>
          </div>
          <div className="feature-card">
            <h3>7️⃣ Complete the Transaction</h3>
            <p>Once the deal is done, update the status and get your item delivered or handed over.</p>
          </div>
          <div className="feature-card">
            <h3>♻️ Contribute to Sustainability</h3>
            <p>By reusing resources, you're helping both your wallet and the planet!</p>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section id="login">
        <Login />
      </section>

      {/* Contact Section (Optional placeholder) */}
      <section id="contact" className="contact-section">
        <h2>Contact Us</h2>
        <p>Email: support@educycle.com</p>
        <p>Phone: +91 9876543210</p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 EduCycle. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Home
