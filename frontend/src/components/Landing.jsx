import React from "react";
import { FaRocket, FaBrain, FaChartLine, FaFileAlt } from "react-icons/fa";
import "../style/Landing.css";


const currentYear = new Date().getFullYear();
const Landing = ({ onGetStarted }) => {
  return (
    <div className="landing-container">
      {/* ===== Hero Section ===== */}
      <section className="landing-hero">
        <div className="hero-content">
          <h1 className="brand-title">
            <FaRocket className="brand-icon" /> EduNova
          </h1>

          <p className="tagline">
            AI-Powered Smart Student Ecosystem
          </p>

          <p className="description">
            EduNova is an intelligent platform that helps students improve
            academics, analyze skill gaps, forecast careers, and build
            industry-ready resumes — all in one place.
          </p>

          <button className="cta-btn" onClick={onGetStarted}>
            SignIn To Get Started
          </button>
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section className="features">
        <div className="feature-card">
          <FaBrain size={40} />
          <h3>AI Study Assistant</h3>
          <p>
            Personalized insights, weak topic detection, and smart learning
            recommendations.
          </p>
        </div>

        <div className="feature-card">
          <FaChartLine size={40} />
          <h3>Skill Gap Analyzer</h3>
          <p>
            AI-driven job trends and future skill demand predictions.
          </p>
        </div>

        <div className="feature-card">
          <FaFileAlt size={40} />
          <h3>Resume Enhancer</h3>
          <p>
            Automated resume scoring, feedback, and enhancement using AI.
          </p>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="landing-footer">
        <p>© {currentYear} EduNova • Empowering Students with AI</p>
      </footer>
    </div>
  );
};

export default Landing;
