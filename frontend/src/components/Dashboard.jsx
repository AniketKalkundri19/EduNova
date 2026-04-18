import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { BookOpen, Code, Rocket, Zap, Target, Award } from "lucide-react";
import "../style/Dashboard.css";

const Dashboard = ({ user }) => {
  const { darkMode } = useContext(ThemeContext);

  // ✅ Clean existing lists for logic checks
  const validSkills = user?.customSkills?.filter(s => s.name?.trim()) || [];
  const validProjects = user?.projects?.filter(p => p.title?.trim()) || [];

  // Update check to use valid data only
  const isProfileIncomplete = validSkills.length === 0 && validProjects.length === 0;

  if (!user) {
    return (
      <div className={`dashboard loading-state ${darkMode ? "dark" : ""}`}>
        <div className="loader-ring"></div>
        <p>Synchronizing EduNova Ecosystem...</p>
      </div>
    );
  }

  return (
    <div className={`dashboard ${darkMode ? "dark" : ""}`}>
      {/* ===== Premium Header ===== */}
      <header className="dashboard-header">
        <div className="header-main">
          <h1>
            {isProfileIncomplete ? "Welcome" : "Welcome Back"}, {user?.name?.split(" ")[0] || "Explorer"} 👋
          </h1>
          <p>
            {isProfileIncomplete 
              ? "Please fill the details about your projects and skills to get useful insights in Profile above ⬆️." 
              : "Your academic path is clear. Here is your current standing."}
          </p>
        </div>
        <div className="header-pills">
          <div className="stat-pill">
            <Zap size={16} className="icon-pulse" />
            <span>Year {user.currentYear || "N/A"}</span>
          </div>
          <div className="stat-pill">
            <Target size={16} />
            <span>CGPA: {user.cgpa || "0.0"}</span>
          </div>
        </div>
      </header>

      {/* ===== Grid Layout ===== */}
      <main className="dashboard-grid">
        
        {/* --- Academic Card --- */}
        <section className="card glass-card academics">
          <div className="card-header">
            <BookOpen size={20} className="text-indigo" />
            <h3>Academic Profile</h3>
          </div>
          <div className="info-stack">
            <div className="info-item">
              <label>Current Degree</label>
              <span>{user.degree || "Not set"}</span>
            </div>
            <div className="info-row">
              <div className="info-item">
                <label>10th Grade</label>
                <span>{user.grade10 ? `${user.grade10}%` : "N/A"}</span>
              </div>
              <div className="info-item">
                <label>12th Grade</label>
                <span>{user.grade12 ? `${user.grade12}%` : "N/A"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- Skills Card --- */}
        <section className="card glass-card skills">
          <div className="card-header">
            <Code size={20} className="text-indigo" />
            <h3>Technical Arsenal</h3>
          </div>
          {/* ✅ Check against validSkills instead of raw user.customSkills */}
          {validSkills.length > 0 ? (
            <div className="premium-skills-grid">
              {validSkills.map((skill, i) => (
                <div key={i} className="skill-item-new">
                  <span className="skill-name">{skill.name}</span>
                  <span className={`badge-new ${skill.level?.toLowerCase()}`}>
                    {skill.level}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">No skills indexed yet.</div>
          )}
        </section>

        {/* --- Projects Card (Full Width) --- */}
        <section className="card glass-card projects-full">
          <div className="card-header">
            <Rocket size={20} className="text-indigo" />
            <h3>Innovation Projects</h3>
          </div>
          {/* ✅ Check against validProjects instead of raw user.projects */}
          {validProjects.length > 0 ? (
            <div className="premium-project-grid">
              {validProjects.map((proj, i) => (
                <div key={i} className="project-node">
                  <div className="node-icon"><Award size={18}/></div>
                  <div className="node-content">
                    <h4>{proj.title}</h4>
                    <p>{proj.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">Start your first project to see it here.</div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
