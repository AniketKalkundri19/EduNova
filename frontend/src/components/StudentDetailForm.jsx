import React, { useState } from "react";
import { toast } from "react-hot-toast";
import "../style/StudentFormDetails.css";

// Use the same dynamic URL logic as App.jsx
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://edunova-backend-fypl.onrender.com";

const StudentDetailForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    degree: "",
    currentYear: "",
    cgpa: "",
    grade10: "",
    grade12: "",
    customSkills: [],
    projects: [],
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addCustomSkill = () => {
    setFormData((prev) => ({
      ...prev,
      customSkills: [...prev.customSkills, { name: "", level: "Beginner" }],
    }));
  };

  const changeCustomSkill = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.customSkills];
      updated[index][field] = value;
      return { ...prev, customSkills: updated };
    });
  };

  const removeCustomSkill = (index) => {
    setFormData((prev) => {
      const updated = [...prev.customSkills];
      updated.splice(index, 1);
      return { ...prev, customSkills: updated };
    });
  };

  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [...prev.projects, { title: "", description: "" }],
    }));
  };

  const changeProject = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.projects];
      updated[index][field] = value;
      return { ...prev, projects: updated };
    });
  };

  const removeProject = (index) => {
    setFormData((prev) => {
      const updated = [...prev.projects];
      updated.splice(index, 1);
      return { ...prev, projects: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("User not logged in");
        return;
      }
  
      // ✅ CHANGED: Now using dynamic API_BASE_URL
      const res = await fetch(`${API_BASE_URL}/api/student/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId }),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save data");
  
      toast.success("Profile saved!");
      onSubmit(data.student);
    } catch (error) {
      console.error(error);
      toast.error("Error saving details");
    }
  };

  return (
    <div className="student-form-wrapper">
      <form onSubmit={handleSubmit} className="student-form">
        <h2>Student Details</h2>
        <div className="grid-2">
          <input type="text" placeholder="Degree" value={formData.degree} onChange={(e) => handleChange("degree", e.target.value)} required />
          <input type="text" placeholder="Current Year" value={formData.currentYear} onChange={(e) => handleChange("currentYear", e.target.value)} required />
          <input type="number" placeholder="CGPA" step="0.01" min="0" max="10" value={formData.cgpa} onChange={(e) => handleChange("cgpa", e.target.value)} required />
          <input type="number" placeholder="10th (%)" min="0" max="100" value={formData.grade10} onChange={(e) => handleChange("grade10", e.target.value)} required />
          <input type="number" placeholder="12th (%)" min="0" max="100" value={formData.grade12} onChange={(e) => handleChange("grade12", e.target.value)} required />
        </div>

        <h3>Skills</h3>
        {formData.customSkills.map((skill, idx) => (
          <div key={idx} className="skill-row">
            <input type="text" placeholder="Skill Name" value={skill.name} onChange={(e) => changeCustomSkill(idx, "name", e.target.value)} />
            <select value={skill.level} onChange={(e) => changeCustomSkill(idx, "level", e.target.value)}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Expert</option>
            </select>
            <button type="button" className="remove-btn" onClick={() => removeCustomSkill(idx)}>✕</button>
          </div>
        ))}
        <button type="button" className="add-btn" onClick={addCustomSkill}>+ Add Skill</button>

        <h3>Projects</h3>
        {formData.projects.map((project, idx) => (
          <div key={idx} className="project-row">
            <input type="text" placeholder="Title" value={project.title} onChange={(e) => changeProject(idx, "title", e.target.value)} />
            <textarea placeholder="Description" value={project.description} onChange={(e) => changeProject(idx, "description", e.target.value)} />
            <button type="button" className="remove-btn" onClick={() => removeProject(idx)}>✕</button>
          </div>
        ))}
        <button type="button" className="add-btn" onClick={addProject}>+ Add Project</button>
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default StudentDetailForm;
