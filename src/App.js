import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home'; // Import Home page
import Login from './pages/Login'; // Import Login page
import Dashboard from './pages/Dashboard'; // Import Dashboard page
import Signup from './pages/Signup'; // Import Dashboard page
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute component

function App() {
  return (
    <AuthProvider>
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
          <Route path="*" element={<Home />} />
      </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
