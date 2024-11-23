import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

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
            {/* Logged-in user view */}
            <span className="user-name">Welcome, {user?.name}</span>
            <button className="icon-button" title="Notifications">
              <i className="fa fa-bell"></i>
            </button>
            <button className="icon-button" title="Profile">
              <i className="fa fa-user"></i>
            </button>
            <button className="logout-button" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Guest view */}
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Log In</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
