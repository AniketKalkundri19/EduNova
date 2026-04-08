import React, { useState } from "react";
import { toast } from "react-hot-toast";
import "../style/StudentFormDetails.css";

const StudentDetailsForm = ({ onSubmit }) => {
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
    toast.success("Skill field added");
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
    toast.error("Skill removed");
  };

  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [...prev.projects, { title: "", description: "" }],
    }));
    toast.success("Project field added");
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
    toast.error("Project removed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("User not logged in");
        return;
      }
  
      const res = await fetch("http://localhost:5000/api/student/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId,
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || "Failed to save student data");
      }
  
      toast.success("Student profile saved successfully!");
      onSubmit(data.student); // ✅ send DB data back to App.jsx
    } catch (error) {
      console.error(error);
      toast.error("Error saving student details");
    }
  };
  

  return (
    <div className="student-form-wrapper">
      <form onSubmit={handleSubmit} className="student-form">
        <h2>Student Details</h2>
        <p>Please provide your academic and project information for personalized insights.</p>

        <div className="grid-2">
          <input
            type="text"
            placeholder="Degree"
            value={formData.degree}
            onChange={(e) => handleChange("degree", e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Current Year"
            value={formData.currentYear}
            onChange={(e) => handleChange("currentYear", e.target.value)}
            required
          />
          {/* CGPA usually ranges from 0-10 or 0-4 with decimals */}
  <input
    type="number"
    placeholder="Current CGPA"
    step="0.01"
    min="0"
    max="10"
    value={formData.cgpa}
    onChange={(e) => handleChange("cgpa", e.target.value)}
    required
  />

  {/* Percentages range from 0-100 */}
  <input
    type="number"
    placeholder="10th Grade (%)"
    min="0"
    max="100"
    value={formData.grade10}
    onChange={(e) => handleChange("grade10", e.target.value)}
    required
  />

  <input
    type="number"
    placeholder="12th Grade (%)"
    min="0"
    max="100"
    value={formData.grade12}
    onChange={(e) => handleChange("grade12", e.target.value)}
    required
  />
        </div>

        <h3>Skills</h3>
        {formData.customSkills.map((skill, idx) => (
          <div key={idx} className="skill-row">
            <input
              type="text"
              placeholder="Skill Name"
              value={skill.name}
              onChange={(e) => changeCustomSkill(idx, "name", e.target.value)}
              
            />
            <select
              value={skill.level}
              onChange={(e) => changeCustomSkill(idx, "level", e.target.value)}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Expert</option>
            </select>
            <button type="button" className="remove-btn" onClick={() => removeCustomSkill(idx)}>
              ✕
            </button>
          </div>
        ))}
        <button type="button" className="add-btn" onClick={addCustomSkill}>
          + Add Skill
        </button>

        <h3>Projects</h3>
        {formData.projects.map((project, idx) => (
          <div key={idx} className="project-row">
            <input
              type="text"
              placeholder="Project Title"
              value={project.title}
              onChange={(e) => changeProject(idx, "title", e.target.value)}
              
            />
            <textarea
              placeholder="Project Description"
              value={project.description}
              onChange={(e) => changeProject(idx, "description", e.target.value)}
            />
            <button type="button" className="remove-btn" onClick={() => removeProject(idx)}>
              Remove Project
            </button>
          </div>
        ))}
        <button type="button" className="add-btn" onClick={addProject}>
          + Add Project
        </button>

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
      
    </div>
  );
};

export default StudentDetailsForm;
