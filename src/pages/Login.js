import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import AuthContext
import '../styles/Login.css'; // Import your CSS for styling

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); // Use the login function from AuthContext
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  // Get the page the user was trying to access, default to "/dashboard"
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate credentials
    const isSuccess = login(credentials);
    if (isSuccess) {
      navigate(from, { replace: true }); // Redirect to the intended page or dashboard
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="login-container">
      {/* Logo Section */}
      <div className="logo">
        <img src={require('../images/ShakoyLogo.png')} alt="Shakoy Logo" />
      </div>

      {/* Login Form Section */}
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            className="input-field"
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            className="input-field"
            required
          />
          {error && <p className="error-message">{error}</p>}
          <div className="forgot-password">
            {/* Updated Forgot Password Section */}
            <p
              style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </p>
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        {/* Sign Up Section */}
        <div className="signup-prompt">
          <p>
            Don’t have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
