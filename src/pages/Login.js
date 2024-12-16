import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const Login = () => {
    const navigate = useNavigate(); // Hook for redirection
    const location = useLocation(); // Capture where the user came from

    const { login } = useAuth(); // AuthContext login function
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect to the previous route or default to /dashboard
    const from = location.state?.from?.pathname || '/dashboard';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
    
        console.log('Form Data Sent to Login:', credentials);
    
        try {
            const isSuccess = await login(credentials); // Call login function
            console.log('Login Success Status:', isSuccess);
    
            if (isSuccess) {
                console.log('Redirecting to dashboard...');
                navigate('/dashboard', { replace: true }); // Redirect to dashboard
            } else {
                setError('Invalid email or password.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Logo Section */}
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
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {/* Sign Up Section */}
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
