import React, { useContext } from "react";
import { motion } from "framer-motion";
import { FaRocket, FaCode, FaBullseye, FaLock, FaUserGraduate } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext"; // Import your context
import "../style/About.css";

const About = () => {
  const { darkMode } = useContext(ThemeContext);

  // Parent container for stagger effect
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  // Individual card animation
  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    // Apply the theme class here so the CSS variables know which set to use
    <div className={darkMode ? "dark-theme" : "light-theme"}>
      <motion.div 
        className="about-page-wrapper"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div className="about-header" variants={item}>
          <h1>EduNova Intelligence 🚀</h1>
          <p>Merging Machine Learning with Education for a smarter career path. ✨</p>
        </motion.div>

        <div className="about-grid">
          {/* Mission */}
          <motion.div className="about-glass-card wide-card" variants={item}>
            <FaBullseye className="accent-icon" />
            <h3>The North Star 🎯</h3>
            <p>EduNova was built to bridge the gap between academic theory and industry reality. By using AI diagnostics, we help students identify exactly where they stand in the current job market. 🧠</p>
          </motion.div>

          {/* Tech */}
          <motion.div className="about-glass-card" variants={item}>
            <FaCode className="accent-icon" />
            <h3>The Engine Room ⚙️</h3>
            <p>Powered by the <strong>MERN</strong> stack (MongoDB, Express, React, Node.js) and integrated with the DeepSeek AI API for real-time student insights. 💻</p>
          </motion.div>

          {/* Security */}
          <motion.div className="about-glass-card" variants={item}>
            <FaLock className="accent-icon" />
            <h3>Data Vault 🛡️</h3>
            <p>Your privacy is our priority. We implement strictly timed, <strong>2-hour JWT</strong> session windows to protect your dashboard and secure your account. 🔐</p>
          </motion.div>

          {/* Vision */}
          <motion.div className="about-glass-card wide-card" variants={item}>
            <FaUserGraduate className="accent-icon" />
            <h3>For the Students, By AI 🛰️</h3>
            <p>Whether you're using our Skill Gap Analyzer, Resume Enhancer or chatting with NovaBot, our mission remains the same: Empowering you to build a future you're proud of. 🎓</p>
          </motion.div>
        </div>
      </motion.div>
      
    </div>
  );
};

export default About;
