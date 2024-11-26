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

  return (
    <nav className="navbar">
      {/* Logo on the left */}
      <div className="logo">
        <img
          src={require('../images/ShakoyLogo.png')}
          alt="Shakoy Logo"
          className="logo-image"
        />
      </div>

      {/* Links or actions on the right */}
      <div className="nav-links">
        {isAuthenticated ? (
          <>
            {/* Profile Dropdown */}
            <div className="profile-dropdown">
              <img
                src={require('../images/profile-icon.png')} // Replace with your image path
                alt="Profile"
                className="profile-image"
                title="Profile"
                onClick={toggleDropdown}
              />

              {/* Dropdown Menu */}
              {isDropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/Settings" className="dropdown-item" onClick={closeDropdown}>
                  Settings
                </Link>
                <span
                  className="dropdown-item" // Using the same class as Settings
                  onClick={() => {
                    logout(); // Logs the user out
                    closeDropdown(); // Closes the dropdown
                    navigate('/'); // Redirect to Dashboard page
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
