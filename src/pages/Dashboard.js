import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import { createCategory, createTask, fetchCategories } from "../api/api";

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

  const [categories, setCategories] = useState([]);

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
    const loadCategories = async () => {
      try {
        const response = await fetchCategories();
        setCategories(response.data); // Expecting [{ id, name }]
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const updatedProjects = projects.map((project) => {
      const projectTasks = tasks.filter((task) => task.projectId === project.id);
      const completedTasks = projectTasks.filter((task) => task.status === "Completed").length;
      const totalTasks = projectTasks.length;
      const completion = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      return { ...project, completion };
    });
    setProjects(updatedProjects);
  }, [tasks]);

  const handleAddCategory = async () => {
    const categoryName = prompt("Enter category name:");
    if (categoryName) {
      try {
        const response = await createCategory({ name: categoryName, user_id: 1 });
        setCategories((prev) => [...prev, { id: response.data.id, name: categoryName }]);
        alert("Category added successfully!");
      } catch (error) {
        console.error("Error creating category:", error);
        alert("Failed to add category.");
      }
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

  const handleSaveProject = async () => {
    if (!newProject.name || !newProject.category || !newProject.deadline) {
      alert("Please fill in all required fields before saving the project.");
      return;
    }

    const taskData = {
      title: newProject.name,
      description: newProject.description || "",
      category: newProject.category, // Send category name directly
      due_date: newProject.deadline,
    };

    try {
      const response = await createTask(taskData);
      alert("Project saved successfully!");
      setProjects((prev) => [
        ...prev,
        { ...newProject, id: Date.now(), status: "In Progress", completion: 0 },
      ]);
      handleCloseModal();
    } catch (error) {
      console.error("Error saving project:", error.response?.data || error.message);
      alert("Failed to save project. Please try again.");
    }
  };

  const handleDeleteProject = (projectId) => {
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (confirmed) {
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
      setTasks((prev) => prev.filter((task) => task.projectId !== projectId));
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
              categories.map((category) => (
                <li
                  key={category.id}
                  className={`category-item ${selectedCategory === category.name ? "active" : ""}`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
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
                    <div
                      className={`project-card ${
                        project.status ? project.status.toLowerCase() : "in-progress"
                      }`}
                      key={project.id}
                    >
                      <div className="project-header">
                        <h3>
                          {project.name}
                          <span
                            className={`status ${
                              project.status
                                ? project.status.toLowerCase().replace(" ", "-")
                                : "in-progress"
                            }`}
                          >
                            {project.status || "In Progress"}
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
                  const isDeadline = projects.some((project) => {
                    const deadline = new Date(project.deadline);
                    return (
                      deadline.getFullYear() === date.year &&
                      deadline.getMonth() === date.month &&
                      deadline.getDate() === day
                    );
                  });
                  const deadlineHighlight = isDeadline ? "highlight" : "";

                  return (
                    <div key={day} className={`day-number ${deadlineHighlight}`}>
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
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name} {/* Use category.name */}
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
