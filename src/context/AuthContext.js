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
            setUser({ token }); // Assume user is logged in if token exists
        }
    }, []);

    // Login function
    const login = async (credentials) => {
        try {
            const response = await axios.post('http://localhost:3000/users/login', credentials);
            const { token, user } = response.data;
    
            // Save token and update user
            localStorage.setItem('token', token);
            setUser(user); // Ensure 'user' has profilePhoto or username
    
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
                localStorage.setItem('token', response.data.token);
                setUser(response.data.user);
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
        setUser(null); // Reset user state
        console.log('User logged out successfully.');
    };

    // Provide all functions and user state
    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
