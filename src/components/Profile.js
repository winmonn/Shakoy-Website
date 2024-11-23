import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Import AuthContext
import '../styles/Profile.css'; // Add your styles here

const Profile = () => {
  const { user, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    alert('Profile updated successfully!'); // Replace with update logic
    setEditMode(false);
  };

  return (
    <div className="profile">
      <h1>Manage Profile</h1>
      {editMode ? (
        <div>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div>
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
