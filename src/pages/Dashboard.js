import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  createTask,
  deleteTask,
  fetchCategories,
} from "../api/api";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();

  const [editingCategory, setEditingCategory] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
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

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Load categories and projects from backend on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const categoryResponse = await fetchCategories();
        setCategories(categoryResponse.data);

        const projectResponse = await axios.get("http://localhost:3000/tasks");
        setProjects(projectResponse.data);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  // Open Edit Category Modal
  const handleOpenEditCategoryModal = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setIsCategoryModalOpen(true);
  };

  // Close Category Modal
  const handleCloseCategoryModal = () => {
    setEditingCategory(null);
    setCategoryName("");
    setIsCategoryModalOpen(false);
  };

    // Add Category
  const handleAddCategory = async () => {
    const categoryName = prompt("Enter category name:");
    if (!categoryName) {
      alert("Category name cannot be empty.");
      return;
    }

    try {
      const response = await createCategory({ name: categoryName, user_id: 1 }); // Assuming `user_id` is 1
      setCategories((prev) => [...prev, { id: response.data.id, name: categoryName }]); // Add new category
      alert("Category added successfully!");
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Failed to add category. Please try again.");
    }
  };


  // Save Category Changes
  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      alert("Category name cannot be empty.");
      return;
    }

    try {
      await updateCategory(editingCategory.id, { name: categoryName });
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, name: categoryName } : cat
        )
      );
      alert("Category updated successfully!");
      handleCloseCategoryModal();
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category. Please try again.");
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmDelete) return;

    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      alert("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category. Please try again.");
    }
  };

  // Open Edit/Add Project Modal
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

  // Close Project Modal
  const handleCloseModal = () => {
    setNewProject({ id: null, name: "", description: "", category: "", deadline: "" });
    setEditingProject(null);
    setIsModalOpen(false);
  };

  // Save Project Changes
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
      let updatedProjects;

      if (editingProject) {
        // EDIT EXISTING PROJECT
        await axios.put(`http://localhost:3000/tasks/${editingProject.id}`, taskData);

        // Update project in the frontend state
        updatedProjects = projects.map((proj) =>
          proj.id === editingProject.id ? { ...proj, ...newProject } : proj
        );
      } else {
        // ADD NEW PROJECT
        const response = await createTask(taskData);
        const newTaskId = response.data.taskId;

        // Add new project to the frontend state
        updatedProjects = [
          ...projects,
          { ...newProject, id: newTaskId, status: "In Progress", completion: 0 },
        ];
      }

      setProjects(updatedProjects);
      alert(editingProject ? "Project updated successfully!" : "Project added successfully!");
      handleCloseModal();
    } catch (error) {
      console.error("Error saving project:", error.response?.data || error.message);
      alert("Failed to save project. Please try again.");
    }
  };

  // Delete Project
  const handleDeleteProject = async (projectId) => {
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;

    try {
      await deleteTask(projectId);
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
      alert("Project deleted successfully!");
    } catch (error) {
      console.error("Error deleting project:", error.response?.data || error.message);
      alert("Failed to delete project. Please try again.");
    }
  };

  // Handle Month Navigation
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

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const daysInMonth = getDaysInMonth(date.month, date.year);

  const filteredProjects = selectedCategory
    ? projects.filter((project) =>
        project.category?.toLowerCase() === selectedCategory.toLowerCase()
      )
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
                  onClick={() => setSelectedCategory(category.name)} // Update selectedCategory
                  style={{ cursor: "pointer" }}
                >
                  <span>{category.name}</span>
                  <div className="category-actions">
                    <button
                      className="edit-button"
                      onClick={() => handleOpenEditCategoryModal(category)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
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

      {isCategoryModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-button" onClick={handleCloseCategoryModal}>
              ×
            </button>
            <h2>Edit Category</h2>
            <div className="form-group">
              <label>Category Name</label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="input-field" />
            </div>
            <button className="save-button" onClick={handleSaveCategory}>
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
