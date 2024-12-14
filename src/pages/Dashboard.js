import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

const Dashboard = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState(() => {
    const savedProjects = JSON.parse(localStorage.getItem("projects"));
    return savedProjects || [];
  });

  const [categories, setCategories] = useState(() => {
    const savedCategories = JSON.parse(localStorage.getItem("categories"));
    return savedCategories || [];
  });

  const [tasks, setTasks] = useState(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    return savedTasks || [];
  });

  const [newProject, setNewProject] = useState({
    id: null,
    name: "",
    description: "",
    category: "",
    deadline: "",
  });

  const [editingProject, setEditingProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState({ month: new Date().getMonth(), year: new Date().getFullYear() });
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    // Update project completion percentage and status
    const updatedProjects = projects.map((project) => {
      const projectTasks = tasks.filter((task) => task.projectId === project.id);
      const completedTasks = projectTasks.filter((task) => task.status === "Completed").length;
      const totalTasks = projectTasks.length;
      const completion = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // Determine status
      const isLate = new Date(project.deadline) < new Date() && completion < 100;
      const status = isLate ? "LATE" : completion === 100 ? "COMPLETED" : "IN PROGRESS";

      return { ...project, completion, status };
    });
    setProjects(updatedProjects);
  }, [tasks]);

  const handleAddCategory = () => {
    const categoryName = prompt("Enter category name:");
    if (categoryName) {
      setCategories((prev) => [...prev, categoryName]);
    }
  };

  const handleOpenModal = (project = null) => {
    if (project) {
      setNewProject({
        id: project.id,
        name: project.name,
        description: project.description,
        category: project.category || "",
        deadline: project.deadline || "",
      });
      setEditingProject(project);
    } else {
      setNewProject({ id: null, name: "", description: "", category: "", deadline: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setNewProject({ id: null, name: "", description: "", category: "", deadline: "" });
    setEditingProject(null);
    setIsModalOpen(false);
  };

  const handleSaveProject = () => {
    if (!newProject.name || !newProject.description || !newProject.deadline || !newProject.category) {
      alert("Please fill in all fields before saving the project.");
      return;
    }

    if (editingProject) {
      setProjects((prev) =>
        prev.map((project) => (project.id === editingProject.id ? { ...project, ...newProject } : project))
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
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
      setTasks((prev) => prev.filter((task) => task.projectId !== projectId)); // Remove tasks of the deleted project
    }
  };

  const handleMonthChange = (direction) => {
    setDate((prev) => {
      let newMonth = prev.month + direction;
      let newYear = prev.year;

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

  const handleViewProject = (projectId) => {
    const project = projects.find((proj) => proj.id === projectId);
    const projectTasks = tasks.filter((task) => task.projectId === projectId);
    navigate(`/project/${projectId}`, { state: { project, tasks: projectTasks } });
  };

  const daysInMonth = getDaysInMonth(date.month, date.year);

  const filteredProjects = selectedCategory
    ? projects.filter((project) => project.category === selectedCategory)
    : projects;

  return (
    <div>
      <Navbar />

      <div className="dashboard-container">
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>Categories</h2>
            <button className="add-category" onClick={handleAddCategory}>
              <FaPlus />
            </button>
          </div>
          <ul>
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <li
                  key={index}
                  className={`category-item ${selectedCategory === category ? "active" : ""}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </li>
              ))
            ) : (
              <p>No categories yet. Add some!</p>
            )}
          </ul>
        </aside>

        <div className="dashboard-main">
          <header className="dashboard-header">
            <h1>Making Task Management a Piece of Shakoy</h1>
          </header>

          <div className="dashboard-content">
            <div className="projects-list">
              <div className="projects-header">
                <h2>Projects</h2>
                <button className="add-project" onClick={() => handleOpenModal()}>
                  +
                </button>
              </div>
              <div className="projects-body">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
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
                          <button onClick={() => handleViewProject(project.id)} className="view-button">
                            <FaEye />
                          </button>
                          <button onClick={() => handleDeleteProject(project.id)} className="delete-button">
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      <p>{project.description}</p>
                      <p>
                        <strong>Category:</strong> {project.category}
                      </p>
                      <p>
                        <strong>Deadline:</strong> {project.deadline}
                      </p>
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
                  <p>No projects found for this category.</p>
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
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;

                    // Find project(s) with a deadline matching this day
                    const projectForDay = projects.find((project) => {
                      const deadline = new Date(project.deadline);
                      return (
                        deadline.getFullYear() === date.year &&
                        deadline.getMonth() === date.month &&
                        deadline.getDate() === day
                      );
                    });

                    // Determine the class for the highlight based on project status
                    let statusHighlight = "";
                    if (projectForDay) {
                      if (projectForDay.status === "LATE") {
                        statusHighlight = "highlight-red";
                      } else if (projectForDay.status === "IN PROGRESS") {
                        statusHighlight = "highlight-yellow";
                      } else if (projectForDay.status === "COMPLETED") {
                        statusHighlight = "highlight-green";
                      }
                    }

                    // Check if the day is the current date
                    const today = new Date();
                    const isToday =
                      today.getFullYear() === date.year &&
                      today.getMonth() === date.month &&
                      today.getDate() === day;

                    const currentDateHighlight = isToday ? "current-date" : "";

                    return (
                      <div key={day} className={`day-number ${statusHighlight} ${currentDateHighlight}`}>
                        {day}
                      </div>
                    );
                  })}
                </div>
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
                  onChange={(e) => setNewProject((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={newProject.category}
                  onChange={(e) => setNewProject((prev) => ({ ...prev, category: e.target.value }))}
                >
                  <option value="">Select a category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={newProject.deadline}
                  onChange={(e) => setNewProject((prev) => ({ ...prev, deadline: e.target.value }))}
                />
              </div>
              <button className="create-project" onClick={handleSaveProject}>
                {editingProject ? "Save Changes" : "Create Project"}
              </button>
            </div>
          </div>
        )}
      </div>
      );
};

      export default Dashboard;
