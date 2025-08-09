import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // 👁️ Eye icons
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👁️ Toggle state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store the token and complete user info in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data.user));

      console.log("Logged in successfully");
      navigate('/dashboard');
    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="logo">EduCycle</h1>
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Login to continue your reselling journey</p>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              className="input-field"
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group password-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                className="input-field"
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            className="submit-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="signup-text">
          Don't have an account?{' '}
          <button type="button" onClick={() => navigate('/signup')} className="link-btn">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
