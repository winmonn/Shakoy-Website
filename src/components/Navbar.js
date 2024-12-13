import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  // Toggles the dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  // Closes the dropdown
  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown')) {
        setIsDropdownOpen(false);
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

  return (
    <nav className="navbar">
      {/* Logo on the left */}
<<<<<<< HEAD
      <div className="logo" onClick={() => navigate('/dashboard')}>
=======
      <div
        className="logo"
        onClick={() => navigate('/dashboard')} // Redirect to the dashboard page
        style={{ cursor: 'pointer' }} // Optional: Change the cursor to indicate it's clickable
      >
>>>>>>> main
        <img
          src={require('../images/ShakoyLogo.png')}
          alt="Shakoy Logo"
          className="logo-image"
          style={{ cursor: 'pointer' }} // Add cursor pointer to indicate clickable
        />
      </div>

      {/* Links or actions on the right */}
      <div className="nav-links">
        {isAuthenticated ? (
          <>
            {/* Profile Dropdown */}
            <div className="profile-dropdown">
              <img
                src={profilePhoto} // Use user's profile photo or default
                alt="Profile"
                className="profile-image"
                title="Profile"
                onClick={toggleDropdown}
              />

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/settings" className="dropdown-item" onClick={closeDropdown}>
                    Settings
                  </Link>
                  <span
                    className="dropdown-item"
                    onClick={() => {
                      logout(); // Logs the user out
                      closeDropdown(); // Closes the dropdown
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
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Log In</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
