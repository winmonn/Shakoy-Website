import React, { useState, useEffect } from 'react';
import '../styles/Settings.css';
import logo from '../images/ShakoyLogo.png'; // Replace with your logo image path
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../context/AuthContext'; // Import AuthContext

const Settings = () => {
  const { user, updateProfilePhoto } = useAuth(); // Get user data and update function from AuthContext
  const [profilePhoto, setProfilePhoto] = useState(null); // State for profile photo
  const navigate = useNavigate(); // Initialize useNavigate

  // Load profile photo from user object on component mount
  useEffect(() => {
    if (user && user.profilePhoto) {
      setProfilePhoto(user.profilePhoto);
    }
  }, [user]);

  // Handle file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result;
        setProfilePhoto(base64Image); // Set the image in state
        updateProfilePhoto(base64Image); // Update in AuthContext and localStorage
      };
      reader.readAsDataURL(file); // Convert file to base64 string
    }
  };

  // Remove profile photo
  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    updateProfilePhoto(null); // Update in AuthContext and localStorage
  };

  return (
    <div className="settings-container">
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
          <div className="profile-photo-placeholder">
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" />
            ) : (
              <div className="placeholder-text">No Photo</div>
            )}
          </div>
          <div className="photo-buttons">
            <input
              type="file"
              id="file-input"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <label htmlFor="file-input" className="change-photo-button">
              Change Photo
            </label>
            <button
              className="remove-photo-button"
              onClick={handleRemovePhoto}
            >
              Remove Photo
            </button>
          </div>
        </div>

        <div className="settings-field">
          <label>Name</label>
          <div className="field-content">
            <input type="text" value={user?.username || ''} readOnly />
            <button>Edit</button>
          </div>
        </div>

        <div className="settings-field">
          <label>Email</label>
          <div className="field-content">
            <input type="email" value={user?.email || ''} readOnly />
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
