import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/NotificationSettings.css'; // Import the CSS file
import logo from '../images/ShakoyLogo.png'; // Replace with your logo path

const NotificationSettings = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className="notification-settings-container">
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
            <Link to="/settings">Account Settings</Link>
          </li>
          <li>
            <Link to="/login-security">Login & Security</Link>
          </li>
          <li>
            <Link to="/privacy-settings">Privacy Settings</Link>
          </li>
          <li className="active">Notification Settings</li>
        </ul>
        <Link to="/dashboard" className="back-arrow">
          &#8592; {/* Unicode for Left Arrow */}
        </Link>
      </div>

      {/* Main Content */}
      <div className="notification-settings-main">
        <div className="section">
          <h2>In-App Notifications</h2>
          <div className="settings-field">
            <label>Choose in-app notification preferences.</label>
            <div className="radio-group">
              <label>
                <input type="radio" name="in-app-notifications" value="Task Updates" defaultChecked />
                Task Updates
              </label>
              <label>
                <input type="radio" name="in-app-notifications" value="Deadlines" />
                Deadlines
              </label>
              <label>
                <input type="radio" name="in-app-notifications" value="Comments" />
                Comments
              </label>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>Push Notifications</h2>
          <div className="settings-field">
            <label>Choose push notification preferences.</label>
            <div className="radio-group">
              <label>
                <input type="radio" name="push-notifications" value="Task Updates" defaultChecked />
                Task Updates
              </label>
              <label>
                <input type="radio" name="push-notifications" value="Deadlines" />
                Deadlines
              </label>
              <label>
                <input type="radio" name="push-notifications" value="Comments" />
                Comments
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
