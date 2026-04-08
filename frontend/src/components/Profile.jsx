import React, { useState } from "react";
import { toast } from "react-hot-toast";
import "../style/ProfilePage.css";

const Profile = ({ user, onProfileUpdate, onLogout }) => {
  const [degree, setDegree] = useState(user.degree || "");
  const [currentYear, setCurrentYear] = useState(user.currentYear || "");
  const [cgpa, setCgpa] = useState(user.cgpa || "");

  const [skills, setSkills] = useState(user.customSkills || []);
  const [projects, setProjects] = useState(user.projects || []);
  const [saving, setSaving] = useState(false);

  /* ===== SKILLS ===== */
  const addSkill = () =>
    setSkills([...skills, { name: "", level: "Beginner" }]);

  const updateSkill = (i, field, value) => {
    const updated = [...skills];
    updated[i][field] = value;
    setSkills(updated);
  };

  const removeSkill = (i) =>
    setSkills(skills.filter((_, idx) => idx !== i));

  /* ===== PROJECTS ===== */
  const addProject = () =>
    setProjects([...projects, { title: "", description: "" }]);

  const updateProject = (i, field, value) => {
    const updated = [...projects];
    updated[i][field] = value;
    setProjects(updated);
  };

  const removeProject = (i) =>
    setProjects(projects.filter((_, idx) => idx !== i));

  /* ===== SAVE ===== */
  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/student/${user.userId || user._id || user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            degree,
            currentYear,
            cgpa,
            customSkills: skills,
            projects,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      onProfileUpdate(data.student);
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">

        {/* HEADER */}
        <header className="profile-header">
          <div>
            <h1 className="profile-title">Student Portfolio</h1>
            <p className="profile-subtitle">
              Update your credentials and technical expertise
            </p>
          </div>

          <button className="btn btn-danger-outline" onClick={onLogout}>
            Logout
          </button>
        </header>

        {/* ACADEMIC BAR (EDITABLE) */}
        <section className="academic-bar">

          <div className="academic-item">
            <span className="academic-label">Degree</span>
            <input
              className="academic-input"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
            />
          </div>

          <div className="academic-item">
            <span className="academic-label">Academic Year</span>
            <select
              className="academic-input"
              value={currentYear}
              onChange={(e) => setCurrentYear(e.target.value)}
            >
              <option value="">Select</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
              
            </select>
          </div>

          <div className="academic-item">
            <span className="academic-label">CGPA</span>
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              className="academic-input highlight"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
            />
          </div>

        </section>

        <div className="profile-content">

          {/* SKILLS */}
          <section className="section-block">
            <div className="section-header">
              <h3>Technical Skills</h3>
              <span className="badge">{skills.length}</span>
            </div>

            {skills.map((s, i) => (
              <div key={i} className="skill-row">
                <input
                  className="input"
                  placeholder="Skill (e.g. Python)"
                  value={s.name}
                  onChange={(e) => updateSkill(i, "name", e.target.value)}
                />

                <select
                  className="input"
                  value={s.level}
                  onChange={(e) => updateSkill(i, "level", e.target.value)}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>

                <button
                  className="btn btn-danger"
                  onClick={() => removeSkill(i)}
                >
                  ✕
                </button>
              </div>
            ))}

            <button className="btn btn-dashed" onClick={addSkill}>
              + Add Skill
            </button>
          </section>

          {/* PROJECTS */}
          <section className="section-block">
            <div className="section-header">
              <h3>Featured Projects</h3>
              <span className="badge">{projects.length}</span>
            </div>

            {projects.map((p, i) => (
              <div key={i} className="project-card">
                <div className="project-header">
                  <input
                    className="project-title-input"
                    placeholder="Project Title"
                    value={p.title}
                    onChange={(e) =>
                      updateProject(i, "title", e.target.value)
                    }
                  />

                  <button
                    className="btn btn-danger-text"
                    onClick={() => removeProject(i)}
                  >
                    Delete
                  </button>
                </div>

                <textarea
                  className="textarea"
                  placeholder="Describe your role, technologies used, and outcomes..."
                  value={p.description}
                  onChange={(e) =>
                    updateProject(i, "description", e.target.value)
                  }
                />
              </div>
            ))}

            <button className="btn btn-dashed" onClick={addProject}>
              + Add Project
            </button>
          </section>

        </div>

        <footer className="profile-footer">
          <button
            className="btn btn-primary full"
            onClick={saveProfile}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save & Synchronize Profile"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Profile;
