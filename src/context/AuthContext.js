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
            const { data } = await loginAPI(credentials); // Call the backend login API
            localStorage.setItem("token", data.token); // Store the token
            setUser({ token: data.token }); // Save user info (optional)
            return true; // Return true on successful login
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || error.message);
            return false; // Return false on failure
        }
    };
    
    
    

    const signup = async (userDetails) => {
        try {
            const response = await signupAPI(userDetails); 
            console.log('Signup API Response:', response); 
            return true; 
        } catch (error) {
            console.error('Signup failed:', error.response?.data || error.message); 
            return false; 
        }
    };
    
  
  

    const logout = () => {
        localStorage.removeItem('token'); 
        setUser(null); 
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
