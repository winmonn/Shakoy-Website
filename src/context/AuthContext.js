import React, { createContext, useContext, useState } from 'react';
import { login as loginAPI, signup as signupAPI } from '../api/api'; 

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (credentials) => {
        try {
            const { data } = await loginAPI(credentials); // Call the backend login endpoint
            localStorage.setItem('token', data.token); // Store JWT in localStorage
            setUser(data.user); // Set user data if included in the response
            return true; // Return success
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message || error.message);
            return false; // Return failure
        }
    };

    const signup = async (userDetails) => {
      try {
          const response = await signupAPI(userDetails); 
          console.log('Signup Response:', response.data); 
          return true; 
      } catch (error) {
          console.error('Signup Error:', error.response?.data || error.message); 
          return false; 
      }
  };
  
  

    const logout = () => {
        localStorage.removeItem('token'); // Clear JWT from localStorage
        setUser(null); // Reset user state
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
