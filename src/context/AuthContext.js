import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user on app start if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserDetails(); // Fetch user details to update state with accurate data
    }
  }, []);

  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users/me');
      setUser(response.data); // Expecting user object with profile details
    } catch (error) {
      console.error('Error fetching user details:', error.response?.data || error.message);
      logout(); // Logout if token is invalid
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:3000/users/login', credentials);
      const { token, user } = response.data;

      // Save token and set headers
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Update user state
      setUser(user); // Ensure 'user' includes profile details

      return true;
    } catch (error) {
      console.error('Login API Error:', error.response?.data || error.message);
      return false;
    }
  };

  // Signup function
  const signup = async (formData) => {
    try {
      const response = await axios.post('http://localhost:3000/users/signup', formData);

      if (response.data.token) {
        const { token, user } = response.data;

        // Save token and set headers
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Update user state
        setUser(user);

        return true;
      } else {
        console.error('Signup API did not return a token.');
        return false;
      }
    } catch (error) {
      console.error('Signup API Error:', error.response?.data || error.message);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token'); // Clear token
    delete axios.defaults.headers.common['Authorization']; // Remove auth header
    setUser(null); // Reset user state
    console.log('User logged out successfully.');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
