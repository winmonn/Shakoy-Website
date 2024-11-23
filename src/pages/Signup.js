import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import AuthContext
import '../styles/Signup.css'; // Import your CSS for styling

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth(); // Use the signup function from AuthContext

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save user data (email, username, password)
    signup(formData);
    alert('Account created successfully! You can now log in.');
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="signup-container">
      {/* Logo Section */}
      <div className="logo">
        <img src={require('../images/ShakoyLogo.png')} alt="Shakoy Logo" />
      </div>

      {/* Signup Form Section */}
      <div className="signup-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            required
          />
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="input-field"
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input-field"
            required
          />
          <button type="submit" className="signup-button">
            Create Account
          </button>
        </form>

        {/* Login Prompt */}
        <div className="login-prompt">
          <p>
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
