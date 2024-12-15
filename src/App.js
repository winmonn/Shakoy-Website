import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import LoginSecurity from "./pages/LoginSecurity";
import PrivateRoute from "./components/PrivateRoute";
import NotificationSettings from "./pages/NotificationSettings";
import PrivacySettings from "./pages/PrivacySettings";
import ProjectView from "./pages/ProjectView";

function App() {
  // Mock project and task data
  const allProjects = [
    {
      id: 1,
      name: "WEB DEV 2",
      description: "All tasks for CIS 2102 Web Development II.",
      status: "In Progress",
      deadline: "2024-11-28",
    },
    {
      id: 2,
      name: "Networking 2",
      description: "All tasks for CIS 2105 Networking II.",
      status: "In Progress",
        deadline: "2024-11-30",
    },
  ];

  const allTasks = [
    {
      id: 1,
      projectId: 1,
      name: "Pointer",
      description: "Pointer is basically a variable that holds an address to another variable.",
      tags: ["Urgent"],
      status: "In Progress",
      deadline: "2024-12-27",
    },
    {
      id: 2,
      projectId: 1,
      name: "ADT LIST",
      description: "ADT is a function that has its own functionality.",
      tags: ["Low"],
      status: "Late",
      deadline: new Date(),
    },
    {
      id: 3,
      projectId: 1,
      name: "Linked-List",
      description: "LL contains nodes that point to another node.",
      tags: ["High"],
      status: "Completed",
      deadline: "2024-12-18",
    },
    {
      id: 4,
      projectId: 2,
      name: "Trunking",
      description: "is a networking technique that consolidates multiple links into a single logical link, improving bandwidth and redundancy",
      tags: ["Low"],
      status: "In Progress",
      deadline: new Date(),
    },
    {
      id: 5,
      projectId: 2,
      name: "IP ADDRESS",
      description: "is a numeric label assigned to devices that use the internet to communicate.",
      tags: ["High"],
      status: "In Progress",
      deadline: new Date(),
    },
  ];

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signup" element={<Signup />} />

          {/* Private Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard projects={allProjects} />
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
          <Route
            path="/notification-settings"
            element={
              <PrivateRoute>
                <NotificationSettings />
              </PrivateRoute>
            }
          />

          {/* New Project-view Page Route */}
          <Route
            path="/project/:projectId"
            element={
              <PrivateRoute>
                <ProjectView allTasks={allTasks} allProjects={allProjects} />
              </PrivateRoute>
            }
          />

          {/* Catch-all Route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
