import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/LoginSecurity.css';
import logo from '../images/ShakoyLogo.png'; // Replace with your logo path

const LoginSecurity = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className="login-security-container">
      {/* Sidebar */}
      <div className="settings-sidebar">
        <img
          src={logo}
          alt="Shakoy Logo"
          className="sidebar-logo"
          onClick={() => navigate('/dashboard')} // Redirect to dashboard on click
          style={{ cursor: 'pointer' }} // Add pointer cursor for clarity
        />
        <ul className="sidebar-links">
          <li>
            <Link to="/settings">Account Settings</Link> {/* Navigate to /settings */}
          </li>
          <li className="active">Login & Security</li>
          <li>
            <Link to="/privacy-settings">Privacy Settings</Link> {/* Placeholder */}
          </li>
          <li>
            <Link to="/notification-settings">Notification Settings</Link> {/* Placeholder */}
          </li>
        </ul>
        <Link to="/dashboard" className="back-arrow">
          &#8592; {/* Unicode for Left Arrow */}
        </Link>
      </div>

      {/* Main Content */}
      <div className="login-security-main">
        <div className="section">
          <h2>Log In</h2>
          <div className="settings-field">
            <label>Password</label>
            <div className="field-content">
              <input type="password" value="************" readOnly />
              <button>Edit</button>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>Security</h2>
          <div className="settings-field">
            <label>Sign out from all devices</label>
            <div className="field-content">
              <button className="sign-out-button">Sign Out</button>
            </div>
          </div>
          <div className="settings-field">
            <label>Delete your account</label>
            <div className="field-content">
              <button className="delete-account-button">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSecurity;
