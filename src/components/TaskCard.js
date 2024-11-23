import React from 'react';
import '../styles/TaskCard.css';

const TaskCard = ({ title, description }) => (
  <div className="task-card">
    <h4>{title}</h4>
    <p>{description}</p>
    <button className="mark-complete">Mark Complete</button>
  </div>
);

export default TaskCard;
