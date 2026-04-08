import React, { useContext } from "react";
import { FaRocket, FaMoon, FaSun, FaUserCircle } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

// ✅ Receive onLogoClick as a prop from App.jsx
const Header = ({ user, onProfileClick, onLogoClick }) => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const firstName = user?.name?.split(" ")[0] || "Guest";

  return (
    <header className={`header ${darkMode ? "dark" : ""}`}
    >
      {/* ✅ Wrap the logo in a div with the onClick handler */}
      <div 
        className="left" 
        onClick={onLogoClick} 
        style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
      >
        <FaRocket size={24} style={{ marginRight: "8px" }} />
        <span className="logo">EduNova</span>
      </div>

      <div className="right" style={{ display: "flex", gap: "12px" }}>
        <button onClick={toggleTheme} className="icon-btn">
          {darkMode ? <FaSun size={26} /> : <FaMoon size={26} />}
        </button>

        {user && (
          <div
            className="profile-icon"
            onClick={onProfileClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "1rem",
              color: darkMode ? "#5053ff" : "#5053ff",
            }}
          >
            <FaUserCircle size={32}/>
            <span>Hi, {firstName} 👋</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;