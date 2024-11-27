import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home'; // Import Home page
import Login from './pages/Login'; // Import Login page
import Dashboard from './pages/Dashboard'; // Import Dashboard page
import Signup from './pages/Signup'; // Import Signup page
import Settings from './pages/Settings'; // Import Settings page
import LoginSecurity from './pages/LoginSecurity';
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute component
import NotificationSettings from './pages/NotificationSettings';
import PrivacySettings from './pages/PrivacySettings';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Private Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />

          <Route
            path="/login-security"
            element={
              <PrivateRoute>
                <LoginSecurity />
              </PrivateRoute>
            }
          />

          <Route
            path="/privacy-settings"
            element={
              <PrivateRoute>
                <PrivacySettings />
              </PrivateRoute>
            }
          />

          {/* <Route>
            path="/notification-settings"
            element={
              <PrivateRoute>
                <NotificationSettings />
              </PrivateRoute>
            }
          </Route> */}

          <Route
            path="/notification-settings"
            element={
              <PrivateRoute>
                <NotificationSettings />
              </PrivateRoute>
            }
          />

          {/* Catch-all Route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
