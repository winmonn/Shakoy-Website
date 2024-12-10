import React, { createContext, useState, useContext, useEffect } from 'react';

// Create AuthContext
const AuthContext = createContext();

// Custom Hook for easier access
export const useAuth = () => useContext(AuthContext);

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state

  // Load user data from localStorage on initialization
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedAuth = localStorage.getItem('isAuthenticated');

    try {
      const parsedUser = JSON.parse(storedUser);

      if (storedAuth === 'true' && parsedUser) {
        setUser(parsedUser);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      setUser(null);
      setIsAuthenticated(false);
    }

    setLoading(false); // Set loading to false after initialization
  }, []);

  // Login function
  const login = ({ username, password }) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.username === username && storedUser.password === password) {
      setUser(storedUser);
      setIsAuthenticated(true);
      return true;
    }

    setIsAuthenticated(false); // Ensure unauthenticated state is clear
    return false;
  };

  // Signup function
  const signup = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
