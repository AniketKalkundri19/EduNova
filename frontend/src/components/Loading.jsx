import React from "react";
import "../style/LoadingScreen.css";

const LoadingScreen = () => {
  return (
    <div className="edunova-loader-wrapper">
      <div className="loader-backdrop"></div>
      <div className="loader-container">
        <div className="logo-section">
          <img 
            src="/EduNova_Logo.png" 
            alt="EduNova Logo" 
            className="animated-logo" 
          />
          {/* Glowing ring around the logo */}
          <div className="logo-glow"></div>
        </div>
        
        <div className="loading-text-container">
          <h2 className="loading-title">EduNova</h2>
          <div className="progress-bar-container">
            <div className="progress-bar-fill"></div>
          </div>
          <p className="loading-status">Synchronizing AI Models...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
