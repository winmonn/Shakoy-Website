// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create AuthContext
const AuthContext = createContext();

// Custom Hook for easier access
export const useAuth = () => useContext(AuthContext);

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Load user data from localStorage on initialization
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Login function (using username and password)
  const login = ({ username, password }) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.username === username && storedUser.password === password) {
      setUser(storedUser);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  // Signup function
  const signup = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData)); // Persist user data
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user'); // Remove user data
  };

  // Update profile photo function
  const updateProfilePhoto = (profilePhoto) => {
    const updatedUser = { ...user, profilePhoto };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser)); // Update localStorage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout, updateProfilePhoto }}>
      {children}
    </AuthContext.Provider>
  );
};
