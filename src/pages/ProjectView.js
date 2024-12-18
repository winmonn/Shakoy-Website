import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/ProjectView.css";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus }) => (
  <div className="project-view-task-card" key={task.id}>
    <h3>{task.name}</h3>
    <p>{task.description}</p>
    <div className="project-view-task-tags">
      {task.tags.map((tag, index) => (
        <span key={index} className="project-view-task-tag">{tag}</span>
      ))}
    </div>
    {task.deadline && (
      <p className="project-view-task-deadline">
        Deadline: {new Date(task.deadline).toLocaleDateString()}
      </p>
    )}
    <div className="task-actions">
      <button className="button button-primary" onClick={() => onEdit(task)}>
        Edit
      </button>
      <button className="button button-primary" onClick={() => onDelete(task.id)}>
        Delete
      </button>
      <button className="button button-primary" onClick={() => onToggleStatus(task.id)}>
        {task.status === "Completed" ? "Revert to In Progress" : "Mark Complete"}
      </button>
    </div>
  </div>
);

const ProjectView = () => {
  const { projectId } = useParams();
  const location = useLocation();

  // Retrieve project and tasks from navigation state
  const [tasks, setTasks] = useState(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    return savedTasks.filter((task) => task.projectId === Number(projectId));
  });
  const [projectName, setProjectName] = useState(
    location.state?.project?.name || "Unknown Project"
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    tags: [],
    deadline: null,
  });
  const [tagInput, setTagInput] = useState("");
  const [date, setDate] = useState({ month: new Date().getMonth(), year: new Date().getFullYear() });

  useEffect(() => {
    // Save tasks to localStorage when they change
    const allTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const otherTasks = allTasks.filter((task) => task.projectId !== Number(projectId));
    localStorage.setItem("tasks", JSON.stringify([...otherTasks, ...tasks]));
  }, [tasks, projectId]);

  const openAddModal = () => {
    setNewTask({ name: "", description: "", tags: [], deadline: null });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setCurrentTask(task);
    setNewTask({ ...task });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleAddTask = () => {
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), ...newTask, status: "In Progress", projectId: Number(projectId) },
    ]);
    setIsModalOpen(false);
  };

  const handleSaveTask = () => {
    setTasks((prev) =>
      prev.map((task) => (task.id === currentTask.id ? { ...newTask, id: task.id } : task))
    );
    setIsModalOpen(false);
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const handleToggleStatus = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: task.status === "Completed" ? "In Progress" : "Completed" }
          : task
      )
    );
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    setNewTask((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setNewTask((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const renderTasks = (filterCondition) =>
    tasks.filter(filterCondition).map((task) => (
      <TaskCard
        key={task.id}
        task={task}
        onEdit={openEditModal}
        onDelete={handleDeleteTask}
        onToggleStatus={handleToggleStatus}
      />
    ));

  const isToday = (date) => {
    const today = new Date();
    const taskDate = new Date(date);
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    );
  };

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

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

  const daysInMonth = getDaysInMonth(date.month, date.year);

  const renderCalendar = () => {
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const today = new Date();
      const isToday =
        today.getFullYear() === date.year &&
        today.getMonth() === date.month &&
        today.getDate() === day;
  
      const dayTasks = tasks.filter((task) => {
        const taskDeadline = new Date(task.deadline);
        return (
          taskDeadline.getFullYear() === date.year &&
          taskDeadline.getMonth() === date.month &&
          taskDeadline.getDate() === day
        );
      });
  
      const isCompleted = dayTasks.some((task) => task.status === "Completed");
      const isInProgress = dayTasks.some(
        (task) =>
          task.status === "In Progress" && new Date(task.deadline) >= today
      );
      const isOverdue = dayTasks.some(
        (task) =>
          task.status !== "Completed" &&
          new Date(task.deadline) < today
      );
  
      let highlightClass = "";
      if (isCompleted) {
        highlightClass = "completed";
      } else if (isOverdue) {
        highlightClass = "overdue";
      } else if (isInProgress) {
        highlightClass = "in-progress";
      }
  
      if (isToday) {
        highlightClass += " current-date";
      }
  
      return (
        <div key={day} className={`day-number ${highlightClass}`}>
          {day}
        </div>
      );
    });
  };
  

  return (
    <div>
      <Navbar />
      <div className="project-view-page">
        <header className="project-view-header">
          <h1>{projectName}</h1>
          <button className="project-view-add-task-button" onClick={openAddModal}>
            Add Task
          </button>
        </header>

        <div className="project-view-content">
          <div className="project-view-tasks">
            <h2>Tasks</h2>
            <div className="project-view-task-cards">
              {renderTasks((task) => task.status !== "Completed" && (!task.deadline || !isToday(task.deadline)))}
            </div>
          </div>

          <div className="project-view-calendar">
            <h2>Calendar</h2>
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
              <div className="calendar-grid">{renderCalendar()}</div>
            </div>
          </div>

          <div className="project-view-completed">
            <h2>Completed Tasks</h2>
            <div className="project-view-task-cards">
              {renderTasks((task) => task.status === "Completed")}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-button" onClick={() => setIsModalOpen(false)}>
              ×
            </button>
            <h2>{isEditing ? "Edit Task" : "Add Task"}</h2>
            <div className="form-group">
              <label htmlFor="task-name">Task Name</label>
              <input
                id="task-name"
                type="text"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="task-description">Description</label>
              <textarea
                id="task-description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="task-deadline">Deadline</label>
              <DatePicker
                id="task-deadline"
                selected={newTask.deadline}
                onChange={(date) => setNewTask({ ...newTask, deadline: date })}
                placeholderText="Set Deadline"
              />
            </div>
            <div className="form-group">
              <label>Tags</label>
              <div className="tag-input">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Enter a tag"
                />
                <button onClick={handleAddTag}>Add Tag</button>
              </div>
              <div className="tag-list">
                {newTask.tags.map((tag, index) => (
                  <span key={index} className="tag-item">
                    {tag}{" "}
                    <button onClick={() => handleRemoveTag(tag)}>&times;</button>
                  </span>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              {isEditing ? (
                <button onClick={handleSaveTask}>Save Task</button>
              ) : (
                <button onClick={handleAddTask}>Add Task</button>
              )}
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectView;
