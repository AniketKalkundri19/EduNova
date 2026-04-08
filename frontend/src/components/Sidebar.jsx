import React, { useState, useContext } from "react";
import { FaTachometerAlt, FaChartLine, FaBriefcase, FaFileAlt, FaBars } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";



const Sidebar = ({ activePage, setActivePage }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { darkMode } = useContext(ThemeContext);

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt /> },
    { name: "SkillGapAnalyzer", icon: <FaChartLine /> },
    { name: "ResumeEnhancer", icon: <FaFileAlt /> },
  ];

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${darkMode ? "dark" : ""}`}>
      <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
        <FaBars />
      </button>
      <ul>
        {menuItems.map((item, idx) => (
          <li
            key={idx}
            className={activePage === item.name ? "active" : ""}
            onClick={() => setActivePage(item.name)}
          >
            <span className="icon">{item.icon}</span>
            {!collapsed && <span className="text">{item.name}</span>}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
