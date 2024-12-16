import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth(); 
    const [credentials, setCredentials] = useState({
        email: '', 
        password: '',
    });
    const [error, setError] = useState('');

    const from = location.state?.from?.pathname || '/dashboard';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data Sent to Login:', credentials);
    
        try {
            const isSuccess = await login(credentials);
            console.log('Login Success Status:', isSuccess); // Log result of login function
    
            if (isSuccess) {
                console.log('Navigating to:', from); // Log where you are trying to navigate
                navigate(from, { replace: true });
            } else {
                console.log('Login failed - Invalid credentials');
                setError('Invalid email or password.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Something went wrong. Please try again later.');
        }
    };
    

    return (
        <div className="login-container">
            <div className="logo">
                <img src={require('../images/ShakoyLogo.png')} alt="Shakoy Logo" />
            </div>

            {/* Login Form Section */}
            <div className="login-form">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email" 
                        placeholder="Email"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                    {error && <p className="error-message">{error}</p>}
                    <div className="forgot-password">
                        <a href="/forgot-password">Forgot Password?</a>
                    </div>
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>

                <div className="signup-prompt">
                    <p>
                        Don’t have an account? <a href="/signup">Sign up</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
