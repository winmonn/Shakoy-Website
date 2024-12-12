import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Navbar from '../components/Navbar'; // Import Navbar component
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle Get Started button click
  const handleGetStarted = () => {
    navigate('/login'); // Redirect to login page
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="home-container">
        <header className="hero">
          {/* Task Cards Section */}
          <div className="task-cards">
            <div className="task-card card1">
              <div className="card-header">This day</div>
              <div className="card-body">
                <p className="task-title">Task</p>
                <p className="task-desc">Packet Tracer</p>
                <button className="mark-complete">Mark complete</button>
              </div>
            </div>

            <div className="task-card card2">
              <div className="card-header">This week</div>
              <div className="card-body">
                <p className="task-title">Task</p>
                <p className="task-desc">Web Dev Project</p>
                <button className="mark-complete">Mark complete</button>
              </div>
            </div>

            <div className="task-card card3">
              <div className="card-header">This day</div>
              <div className="card-body">
                <p className="task-title">Task</p>
                <p className="task-desc">Prog Activity</p>
                <button className="mark-complete">Mark complete</button>
              </div>
            </div>
          </div>

          {/* Hero Text Section */}
          <div className="hero-text">
            <h1>Making Task Management a Piece of Shakoy</h1>
            <button className="get-started" onClick={handleGetStarted}>
              Get Started
            </button>
          </div>
        </header>
      </div>
    </div>
  );
};

export default Home;
