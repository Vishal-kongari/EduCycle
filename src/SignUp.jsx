import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ImageUpload from './components/ImageUpload';

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    department: '',
    year: '',
    phone: '',
    bio: '',
    gender: '',
    profileImage: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageSelected = async (files) => {
    try {
      if (files && files.length > 0) {
        const file = files[0]; // Only take the first file for profile image
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData(prev => ({
            ...prev,
            profileImage: e.target.result
          }));
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      setError('Error processing image. Please try again.');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.password || !formData.college || !formData.gender) {
        throw new Error("Name, email, password, college, and gender are required fields!");
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match!");
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address!");
      }

      // Password validation
      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters long!");
      }

      // Generate a random profile image if not provided
      const defaultImage = formData.profileImage ||
        `https://randomuser.me/api/portraits/${formData.gender === 'female' ? 'women' : 'men'}/${Math.floor(Math.random() * 70) + 1}.jpg`;

      // Prepare user data
      const userData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        college: formData.college.trim(),
        department: formData.department.trim(),
        year: formData.year ? parseInt(formData.year) : null,
        phone: formData.phone.trim(),
        gender: formData.gender,
        profileImage: defaultImage,
        bio: formData.bio.trim() || `${formData.department || 'Student'} at ${formData.college}`
      };

      console.log('Attempting to register with data:', { ...userData, password: '[HIDDEN]' });

      try {
        // Make API call to register user
        const response = await fetch('http://localhost:5000/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        // Log the raw response for debugging
        const responseText = await response.text();
        console.log('Raw server response:', responseText);

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Failed to parse server response:', parseError);
          throw new Error('Server response was not valid JSON. Please check if the server is running.');
        }

        if (!response.ok) {
          throw new Error(data.message || 'Failed to create account');
        }

        // Store token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('userInfo', JSON.stringify({
          _id: data.userId,
          ...userData
        }));

        setSuccess(true);
        console.log("Signed up successfully");

        // Navigate to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);

      } catch (fetchError) {
        if (!fetchError.response) {
          // Network error
          console.error('Network error:', fetchError);
          throw new Error('Cannot connect to the server. Please check if the server is running.');
        }
        throw fetchError;
      }

    } catch (err) {
      console.error("Sign-up error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box signup-box">
        <h1 className="logo">EduCycle</h1>
        {success ? (
          <div className="success-card">
            <h2>Welcome to EduCycle!</h2>
            <p>Your account has been created successfully. Redirecting to dashboard...</p>
          </div>
        ) : (
          <>
            <h2 className="login-title">Create an Account</h2>
            <p className="login-subtitle">Join us and start your sustainable reselling journey</p>

            {error && <div className="error-message">{error}</div>}

            <form className="login-form signup-form" onSubmit={handleSignUp}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Full Name"
                    className="input-field"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">College Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="College Email Address"
                    className="input-field"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group password-group">
                  <label htmlFor="password">Password *</label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Password"
                      className="input-field"
                      value={formData.password}
                      onChange={handleChange}
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
                <div className="form-group password-group">
                  <label htmlFor="confirmPassword">Confirm Password *</label>
                  <div className="password-input-container">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      className="input-field"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="college">College *</label>
                  <input
                    type="text"
                    id="college"
                    name="college"
                    placeholder="College Name"
                    className="input-field"
                    value={formData.college}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    placeholder="Department (e.g., CSE, ECE)"
                    className="input-field"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="year">Year</label>
                  <select
                    id="year"
                    name="year"
                    className="input-field"
                    value={formData.year}
                    onChange={handleChange}
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="gender">Gender *</label>
                  <select
                    id="gender"
                    name="gender"
                    className="input-field"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Phone Number"
                    className="input-field"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us about yourself..."
                    className="input-field"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Profile Image</label>
                <ImageUpload
                  onImagesSelected={handleImageSelected}
                  maxImages={1}
                  currentImages={formData.profileImage ? [formData.profileImage] : []}
                />
                <p className="image-hint">Upload your profile picture or we'll generate one based on your gender</p>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              <p className="login-link">
                Already have an account?{' '}
                <button type="button" onClick={() => navigate('/login')} className="link-btn">
                  Log In
                </button>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default SignUp;
