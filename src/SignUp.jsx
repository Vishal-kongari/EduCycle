import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import './Login.css'; // Using the same styles
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Signed up:", userCredential.user);
      setSuccess(true);

      // Navigate to login section after 3 seconds
      setTimeout(() => {
        navigate('/#login'); // assuming your login section is on home page with id="login"
      }, 3000);
    } catch (err) {
      console.error("Sign-up error:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="logo">EduCycle</h1>
        {success ? (
          <div className="success-card">
            <h2>Welcome to EduCycle!</h2>
            <p>Your account has been created successfully. Redirecting to login...</p>
          </div>
        ) : (
          <>
            <h2 className="login-title">Create an Account</h2>
            <p className="login-subtitle">Join us and start your sustainable reselling journey</p>

            <form className="login-form" onSubmit={handleSignUp}>
              <input
                type="text"
                placeholder="Full Name"
                className="input-field"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="College Email Address"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create Password"
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="input-field"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button type="submit" className="login-button">Sign Up</button>
              {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
            </form>

            <p className="signup-text">
              Already have an account? <a href="/">Go to Login</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default SignUp;
