import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/PrivacySettings.css'; // Import the CSS file
import logo from '../images/ShakoyLogo.png'; // Replace with your logo path

const PrivacySettings = () => {
  return (
    <div className="privacy-settings-container">
      {/* Sidebar */}
      <div className="settings-sidebar">
        <img src={logo} alt="Shakoy Logo" className="sidebar-logo" />
        <ul className="sidebar-links">
          <li>
            <Link to="/settings">Account Settings</Link>
          </li>
          <li>
            <Link to="/login-security">Login & Security</Link>
          </li>
          <li className="active">Privacy Settings</li>
          <li>
            <Link to="/notification-settings">Notification Settings</Link>
          </li>
        </ul>
        <Link to="/dashboard" className="back-arrow">
          &#8592; {/* Unicode for Left Arrow */}
        </Link>
      </div>

      {/* Main Content */}
      <div className="privacy-settings-main">
        <div className="section">
          <h2>Profile Visibility</h2>
          <div className="settings-field">
            <label>Who can see your profile information?</label>
            <div className="radio-group">
              <label>
                <input type="radio" name="profile-visibility" value="Public" defaultChecked />
                Public
              </label>
              <label>
                <input type="radio" name="profile-visibility" value="Collaborators Only" />
                Collaborators Only
              </label>
              <label>
                <input type="radio" name="profile-visibility" value="Private" />
                Private
              </label>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>Task Visibility</h2>
          <div className="settings-field">
            <label>Choose who can view your tasks</label>
            <div className="radio-group">
              <label>
                <input type="radio" name="task-visibility" value="Public" defaultChecked />
                Public
              </label>
              <label>
                <input type="radio" name="task-visibility" value="Collaborators Only" />
                Collaborators Only
              </label>
              <label>
                <input type="radio" name="task-visibility" value="Private" />
                Private
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
