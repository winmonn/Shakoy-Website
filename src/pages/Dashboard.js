import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";
import { FaEdit, FaTrash, FaUserCircle } from "react-icons/fa";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

const calculateCompletion = (deadline) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);

  if (today >= deadlineDate) {
    return 100;
  }

  const totalDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.ceil(
    (today - new Date(today.getFullYear(), today.getMonth(), today.getDate())) /
      (1000 * 60 * 60 * 24)
  );

  const progress = ((elapsedDays / totalDays) * 100).toFixed(2);

  return Math.min(Math.max(progress, 0), 100);
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "WEB DEV 2",
      description: "All tasks for CIS 2102 Web Development II.",
      status: "In Progress",
      collaborators: [],
      deadline: "2024-11-28",
      completion: 0,
    },
    {
      id: 2,
      name: "Networking 2",
      description: "All tasks for CIS 2105 Networking II.",
      status: "In Progress",
      collaborators: [],
      deadline: "2024-11-30",
      completion: 0,
    },
  ]);

  const [newProject, setNewProject] = useState({
    id: null,
    name: "",
    description: "",
    collaborators: [],
    deadline: "",
  });

  const [editingProject, setEditingProject] = useState(null);
  const [date, setDate] = useState({ month: 10, year: 2024 });

  useEffect(() => {
    const today = new Date();

    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        const completion = calculateCompletion(project.deadline);
        const status = today >= new Date(project.deadline) ? "Completed" : "In Progress";

        return { ...project, completion, status };
      })
    );
  }, [projects]);

  const handleMonthChange = (direction) => {
    setDate((prevDate) => {
      let newMonth = prevDate.month + direction;
      let newYear = prevDate.year;

      if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      } else if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      }

      return { month: newMonth, year: newYear };
    });
  };

  const handleOpenModal = (project = null) => {
    if (project) {
      setNewProject({
        id: project.id,
        name: project.name,
        description: project.description,
        collaborators: project.collaborators || [],
        deadline: project.deadline || "",
      });
      setEditingProject(project);
    } else {
      setNewProject({ id: null, name: "", description: "", collaborators: [], deadline: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setNewProject({ id: null, name: "", description: "", collaborators: [], deadline: "" });
    setEditingProject(null);
    setIsModalOpen(false);
  };

  const DESCRIPTION_LIMIT = 150;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "description" && value.length > DESCRIPTION_LIMIT) {
      return;
    }

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
    if (!newProject.name || !newProject.description || !newProject.deadline) {
      alert("Please fill in all fields before saving the project.");
      return;
    }

    if (editingProject) {
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === editingProject.id ? { ...project, ...newProject } : project
        )
      );
    } else {
      setProjects((prev) => [
        ...prev,
        { ...newProject, id: Date.now(), status: "In Progress", completion: 0 },
      ]);
    }
    handleCloseModal();
  };

  const handleDeleteProject = (projectId) => {
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (confirmed) {
      setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId));
    }
  };

  const handleProjectDisplay = () => {
    navigate("/ProjectDisplay");
  };

  const daysInMonth = getDaysInMonth(date.month, date.year);

  return (
    <div>
      <Navbar />

      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Making Task Management a Piece of Shakoy</h1>
        </header>

        <div className="dashboard-content">
          <div className="projects-list">
            <div className="projects-header">
              <h2>Projects</h2>
              <div>
                <button className="add-project" onClick={() => handleOpenModal()}>
                  +
                </button>
                <button
                  className="project-display"
                  onClick={() => navigate("/ProjectDisplay")} // Ensure this matches the route
                >
                  <FaUserCircle />
                </button>
              </div>
            </div>
            <div className="projects-body">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div className={`project-card ${project.status.toLowerCase()}`} key={project.id}>
                    <div className="project-header">
                      <h3>
                        {project.name}
                        <span className={`status ${project.status.toLowerCase().replace(" ", "-")}`}>
                          {project.status}
                        </span>
                      </h3>
                      <div className="project-actions">
                        <button onClick={() => handleOpenModal(project)} className="edit-button">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDeleteProject(project.id)} className="delete-button">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <p>{project.description}</p>
                    <p>
                      <strong>Deadline:</strong> {project.deadline}
                    </p>
                    {project.collaborators.length > 0 && (
                      <p className="collaborators">
                        <strong>Collaborators:</strong>
                        {project.collaborators.map((collaborator, index) => (
                          <span key={index}>{collaborator}</span>
                        ))}
                      </p>
                    )}
                    <div className="progress-container">
                      <label>Completion:</label>
                      <div className="progress-bar">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${project.completion}%` }}
                        />
                      </div>
                      <span>{project.completion}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No projects found.</p>
              )}
            </div>
          </div>

          <div className="calendar">
            <div className="calendar-header">
              <button className="nav-arrow" onClick={() => handleMonthChange(-1)}>
                &lt;
              </button>
              <h2>{`${months[date.month]} ${date.year}`}</h2>
              <button className="nav-arrow" onClick={() => handleMonthChange(1)}>
                &gt;
              </button>
            </div>
            <div className="calendar-grid">
              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
                <div className="day-name" key={day}>
                  {day}
                </div>
              ))}
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const isDeadline = projects.some((project) => {
                  const projectDeadline = new Date(project.deadline);
                  return (
                    projectDeadline.getFullYear() === date.year &&
                    projectDeadline.getMonth() === date.month &&
                    projectDeadline.getDate() === day
                  );
                });

                return (
                  <div key={day} className={`day-number ${isDeadline ? "highlight" : ""}`}>
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-button" onClick={handleCloseModal}>
              ×
            </button>
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
                placeholder={`Enter project description (Max ${DESCRIPTION_LIMIT} characters)`}
              />
              <small>
                {newProject.description.length}/{DESCRIPTION_LIMIT} characters
              </small>
            </div>
            <div className="form-group">
              <label>Deadline</label>
              <input
                type="date"
                name="deadline"
                value={newProject.deadline || ""}
                onChange={handleInputChange}
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
                <button className="add-collaborator" onClick={handleAddCollaborator}>
                  +
                </button>
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