import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBell } from "react-icons/fa";
import '../styles/Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout, loading } = useAuth(); // Include loading state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false); // For notifications dropdown
  const [notifications, setNotifications] = useState([
    "Your task is due tomorrow",
    "New comment on your project",
    "Project deadline updated"
  ]); // Example notifications
  const navigate = useNavigate();

  // Toggles the profile dropdown visibility
  const toggleProfileDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
    setIsNotificationsOpen(false); // Close notifications dropdown if open
  };

  // Toggles the notifications dropdown visibility
  const toggleNotificationsDropdown = () => {
    setIsNotificationsOpen((prevState) => !prevState);
    setIsDropdownOpen(false); // Close profile dropdown if open
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown') && !event.target.closest('.notifications-dropdown')) {
        setIsDropdownOpen(false);
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Get profile photo from user or use default
  const defaultProfileImage = require('../images/profile-icon.png');
  const profilePhoto = user?.profilePhoto || defaultProfileImage;

  // Show a placeholder or loading state while authentication is resolving
  if (loading) {
    return <div>Loading Navbar...</div>;
  }

  return (
    <nav className="navbar">
      {/* Logo on the left */}
      <div className="logo" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}>
        <img
          src={require('../images/ShakoyLogo.png')}
          alt="Shakoy Logo"
          className="logo-image"
          style={{ cursor: 'pointer' }}
        />
      </div>

      {/* Links or actions on the right */}
      <div className="nav-links">
        {isAuthenticated ? (
          <>
            {/* Notification Icon */}
            <div className="notifications-dropdown">
              <FaBell
                className="bell-icon"
                title="Notifications"
                onClick={toggleNotificationsDropdown}
              />
              {isNotificationsOpen && (
                <div className="dropdown-menu notifications-menu">
                  <h4>Notifications</h4>
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <p key={index} className="notification-item">
                        {notification}
                      </p>
                    ))
                  ) : (
                    <p className="notification-item">No notifications</p>
                  )}
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="profile-dropdown">
              <img
                src={profilePhoto} // Use user's profile photo or default
                alt="Profile"
                className="profile-image"
                title="Profile"
                onClick={toggleProfileDropdown}
              />

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="dropdown-menu profile-menu">
                  <Link to="/settings" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                    Settings
                  </Link>
                  <span
                    className="dropdown-item"
                    onClick={() => {
                      logout(); // Logs the user out
                      setIsDropdownOpen(false); // Closes the dropdown
                      navigate('/'); // Redirect to home page
                    }}
                  >
                    Log Out
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/signup" className="nav-link">Sign Up</Link>
            <Link to="/login" className="nav-link">Log In</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
