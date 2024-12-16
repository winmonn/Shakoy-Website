import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginAPI, signup as signupAPI } from '../api/api';

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
            const { data } = await loginAPI(credentials); // Call backend login API
            localStorage.setItem('token', data.token); // Save token to localStorage
            setUser({ token: data.token }); // Set user in state
            console.log('Login successful, token saved.');
            return true; // Login successful
        } catch (error) {
            console.error(
                'Login failed:',
                error.response?.data?.message || error.message
            );
            return false; // Login failed
        }
    };

    // Signup function
    const signup = async (userDetails) => {
        try {
            const { data } = await signupAPI(userDetails); // Call backend signup API
            console.log('Signup API Response:', data);

            // Save token if it exists
            if (data.token) {
                localStorage.setItem('token', data.token);
                setUser({ token: data.token }); // Set user in state
                console.log('Signup successful, token saved.');
            }

            return true; // Signup successful
        } catch (error) {
            console.error(
                'Signup failed:',
                error.response?.data?.message || error.message
            );
            return false; // Signup failed
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token'); // Clear token
        setUser(null); // Reset user state
        console.log('User logged out successfully.');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
