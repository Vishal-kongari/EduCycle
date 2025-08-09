import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css'
import Footer from './Footer'
import Login from './Login'

function Home() {
  return (
    <div className="home-container">
      {/* Navbar */}
      <header className="navbar">
        <div className="logo-container">
          <img src="logo.png" alt="EduCycle Logo" className="logo-img" />
          <span className="highlight">EduCycle</span>
        </div>
        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#categories">Categories</a>
          <a href="#contact">Contact</a>
          <Link to="/login">Sign In</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to <span className="gradient-text">EduCycle</span>
            </h1>
            <p className="hero-subtitle">
              Don't Trash It, Just Cash It! A sustainable reselling platform for students, by students.
            </p>
            <div className="hero-buttons">
              <Link to="/login" className="hero-button primary">
                Get Started
              </Link>
              <a href="#features" className="hero-button secondary">
                Learn More
              </a>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="/logo.png"
              alt="EduCycle platform"
              className="hero-img"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="features-container">
          <h2 className="features-title">
            Why Choose <span className="gradient-text">EduCycle</span>?
          </h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎓</div>
              <h3 className="feature-heading">College Verified</h3>
              <p className="feature-description">
                Only students with verified college emails can join, creating a trusted community.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3 className="feature-heading">Direct Chat</h3>
              <p className="feature-description">
                Chat directly with buyers or sellers to negotiate prices and arrange meetups.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3 className="feature-heading">Student Pricing</h3>
              <p className="feature-description">
                Fair price limits ensure everything remains affordable for students.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">♻️</div>
              <h3 className="feature-heading">Eco-Friendly</h3>
              <p className="feature-description">
                Reduce waste by giving educational materials a second life in your community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section" id="categories">
        <div className="categories-container">
          <h2 className="section-title">
            Browse by <span className="gradient-text">Category</span>
          </h2>
          <div className="categories-grid">
            <a href="#login" className="category-card">
              <div className="category-icon books-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="category-title">Books</h3>
              <p className="category-description">Textbooks, novels, study materials and more</p>
            </a>

            <a href="#login" className="category-card">
              <div className="category-icon stationery-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </div>
              <h3 className="category-title">Stationery</h3>
              <p className="category-description">Notebooks, pens, art supplies and more</p>
            </a>

            <a href="#login" className="category-card">
              <div className="category-icon electronics-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="category-title">Electronics</h3>
              <p className="category-description">Calculators, laptops, accessories and more</p>
            </a>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section id="login">
        <Login />
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="section-container">
          <h2 className="section-title">
            How <span className="gradient-text">EduCycle</span> Works
          </h2>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Sign Up</h3>
              <p className="step-description">
                Create an account using your college email to get verified access.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Browse or List</h3>
              <p className="step-description">
                Find what you need or list items you want to sell with photos and details.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Connect & Exchange</h3>
              <p className="step-description">
                Chat with buyers/sellers, agree on a price, and complete the exchange.
              </p>
            </div>
          </div>

          <div className="cta-button-container">
            <a href="/signup" className="cta-button">
              Join EduCycle Today
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section" id="testimonials">
        <div className="section-container">
          <h2 className="section-title">
            What <span className="gradient-text">Students Say</span>
          </h2>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="star">★</span>
                ))}
              </div>
              <p className="testimonial-text">
                "I saved over ₹5,000 on textbooks this semester using EduCycle! The verification system makes it feel
                safe to buy from other students."
              </p>
              <p className="testimonial-author">- Priya S., Delhi University</p>
            </div>

            <div className="testimonial-card">
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="star">★</span>
                ))}
              </div>
              <p className="testimonial-text">
                "Sold my old calculator and drawing tools in just 2 days! The chat feature made it easy to coordinate
                with the buyer right on campus."
              </p>
              <p className="testimonial-author">- Rahul M., IIT Bombay</p>
            </div>

            <div className="testimonial-card">
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="star">★</span>
                ))}
              </div>
              <p className="testimonial-text">
                "As a first-year student, EduCycle helped me find affordable electronics and books. The UI is fun and
                super easy to navigate!"
              </p>
              <p className="testimonial-author">- Ananya K., VIT Vellore</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <h2 className="cta-title">Ready to Join EduCycle?</h2>
          <p className="cta-subtitle">
            Join thousands of students across India who are saving money and reducing waste through our college
            marketplace.
          </p>
          <a href="/signup" className="cta-button secondary">
            Sign Up with College Email
          </a>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home
