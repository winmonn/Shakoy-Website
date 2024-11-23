import React, { useState } from 'react';
import Navbar from '../components/Navbar'; // Import Navbar
import '../styles/Dashboard.css'; // Import CSS for styling
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons for editing and deleting

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [projects, setProjects] = useState([
    {
      name: "WEB DEV 2",
      description: "All tasks for CIS 2102 Web Development II for 2nd Year 1st Semester 2024 in University of San Carlos.",
      status: "In Progress",
    },
    {
      name: "Networking 2",
      description: "All tasks for CIS 2105 Networking II for 2nd Year 1st Semester 2024 in University of San Carlos.",
      status: "In Progress",
    },
  ]);

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    collaborators: [],
  });

  const [editingProject, setEditingProject] = useState(null); // Track the project being edited

  const [date, setDate] = useState({ month: 9, year: 2024 }); // Default to October 2024

  const handleMonthChange = (direction) => {
    setDate((prevDate) => {
      let newMonth = prevDate.month + direction;
      let newYear = prevDate.year;

      if (newMonth < 0) {
        newMonth = 11; // Wrap to December
        newYear -= 1;
      } else if (newMonth > 11) {
        newMonth = 0; // Wrap to January
        newYear += 1;
      }

      return { month: newMonth, year: newYear };
    });
  };

  const handleOpenModal = (project = null) => {
    if (project) {
      setNewProject(project);
      setEditingProject(project);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setNewProject({ name: '', description: '', collaborators: [] });
    setEditingProject(null);
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCollaborator = () => {
    const collaboratorName = prompt("Enter collaborator's name:");
    if (collaboratorName) {
      setNewProject((prev) => ({
        ...prev,
        collaborators: [...prev.collaborators, collaboratorName],
      }));
    }
  };

  const handleSaveProject = () => {
    if (newProject.name && newProject.description) {
      if (editingProject) {
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.name === editingProject.name ? newProject : project
          )
        );
      } else {
        setProjects((prev) => [...prev, { ...newProject, status: "In Progress" }]);
      }
      handleCloseModal(); // Close modal after saving
    } else {
      alert("Please fill in all fields before saving the project.");
    }
  };

  const handleDeleteProject = (projectName) => {
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (confirmed) {
      setProjects((prevProjects) => prevProjects.filter((project) => project.name !== projectName));
    }
  };

  const daysInMonth = getDaysInMonth(date.month, date.year);

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Dashboard Content */}
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Making Task Management a Piece of Shakoy</h1>
        </header>

        <div className="dashboard-content">
          <div className="projects-list">
            <div className="projects-header">
              <h2>Projects</h2>
              <button className="add-project" onClick={() => handleOpenModal()}>+</button>
            </div>
            <div className="projects-body">
              {projects.map((project, index) => (
                <div className={`project-card ${project.status.toLowerCase()}`} key={index}>
                  <div className="project-header">
                    <h3>
                      {project.name} <span className="status">{project.status}</span>
                    </h3>
                    <div className="project-actions">
                      <button onClick={() => handleOpenModal(project)} className="edit-button">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDeleteProject(project.name)} className="delete-button">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <p>{project.description}</p>
                  {project.collaborators && project.collaborators.length > 0 && (
                    <p><strong>Collaborators:</strong> {project.collaborators.join(', ')}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="calendar">
            <div className="calendar-header">
              <button className="nav-arrow" onClick={() => handleMonthChange(-1)}>&lt;</button>
              <h2>{`${months[date.month]} ${date.year}`}</h2>
              <button className="nav-arrow" onClick={() => handleMonthChange(1)}>&gt;</button>
            </div>
            <div className="calendar-grid">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                <div className="day-name" key={day}>{day}</div>
              ))}
              {[...Array(daysInMonth)].map((_, i) => (
                <div className="day-number" key={i + 1}>{i + 1}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Adding/Editing a Project */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-button" onClick={handleCloseModal}>×</button>
            <h2>{editingProject ? "Edit Project" : "Create a Project"}</h2>
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                name="name"
                value={newProject.name}
                onChange={handleInputChange}
                placeholder="Enter project name"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={newProject.description}
                onChange={handleInputChange}
                placeholder="Enter project description"
              />
            </div>
            <div className="form-group">
              <label>Collaborators</label>
              <div className="collaborators">
                {newProject.collaborators.map((collaborator, index) => (
                  <span className="collaborator" key={index}>
                    {collaborator}
                  </span>
                ))}
                <button className="add-collaborator" onClick={handleAddCollaborator}>+</button>
              </div>
            </div>
            <button className="create-project" onClick={handleSaveProject}>
              {editingProject ? "Save Changes" : "Create Project"}
            </button>
            <button className="discard" onClick={handleCloseModal}>
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
