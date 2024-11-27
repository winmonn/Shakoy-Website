import React from 'react';
import '../styles/Settings.css';
import logo from '../images/ShakoyLogo.png'; // Replace with your logo image path
import { Link } from 'react-router-dom'; // Import Link from react-router-dom


const Settings = () => {
  return (
    <div className="settings-container">
      {/* Sidebar */}
      <div className="settings-sidebar">
        <img src={logo} alt="Shakoy Logo" className="sidebar-logo" />
        <ul className="sidebar-links">
        <li className="active">Account Settings</li>
          <li>
            <Link to="/login-security">Login & Security</Link>
          </li>
          <li>
            <Link to="/privacy-settings">Privacy Settings</Link>
          </li>
          <li>
            <Link to="/notification-settings">Notification Settings</Link>
          </li>
        </ul>
        <Link to="/dashboard" className="back-arrow">
          &#8592; {/* Unicode for Left Arrow */}
        </Link>
      </div>

      {/* Main Content */}
      <div className="settings-main">
        <h2>Profile Photo</h2>
        <div className="profile-section">
          <div className="profile-photo-placeholder"></div>
          <div className="photo-buttons">
            <button className="change-photo-button">Change Photo</button>
            <button className="remove-photo-button">Remove Photo</button>
          </div>
        </div>

        <div className="settings-field">
          <label>Name</label>
          <div className="field-content">
            <input type="text" value="Jude M. Ando" readOnly />
            <button>Edit</button>
          </div>
        </div>

        <div className="settings-field">
          <label>Email</label>
          <div className="field-content">
            <input type="email" value="23101876@usc.edu.ph" readOnly />
            <button>Edit</button>
          </div>
        </div>

        <div className="settings-field">
          <label>Language</label>
          <div className="field-content">
            <input type="text" value="English" readOnly />
            <button>Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
