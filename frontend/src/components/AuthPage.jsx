// src/components/AuthPage.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast"; 
import { FaRocket, FaSpinner } from "react-icons/fa"; // Added FaSpinner
import "../style/AuthPage.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://edunova-backend-fypl.onrender.com";

const AuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false); // New Loading State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    document.body.classList.add("auth-active");
    return () => document.body.classList.remove("auth-active");
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start Loading

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Authentication failed!");
        setLoading(false); // Stop Loading on error
        return;
      }

      toast.success(data.message);

      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("userName", data.user.name); 
      
      if (data.token) {
        localStorage.setItem("edu_token", data.token);
      }

      if (window.PasswordCredential && navigator.credentials) {
        const cred = new PasswordCredential({
          id: formData.email,
          password: formData.password,
          name: data.user.name || formData.name, 
        });

        navigator.credentials.store(cred)
          .then(() => console.log("Browser prompt triggered successfully."))
          .catch((err) => console.log("Browser rejected the prompt:", err));
      }

      setTimeout(() => {
        setLoading(false); // Stop Loading before moving to dashboard
        onAuthSuccess({
          ...data.user,
          isNewUser: !isLogin, 
        });
      }, 400);

    } catch (error) {
      setLoading(false); // Stop Loading on crash
      toast.error("Server connection failed. Checking connection...");
      console.error("Connection Error:", error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-left">
          <h2 className="auth-title">
            {isLogin ? "Welcome Back 👋" : "Join EduNova 🚀"}
          </h2>
          <p className="auth-subtitle">
            {isLogin
              ? "Login to access your personalized student dashboard."
              : "Create your account and unlock smart AI-powered learning!"}
          </p>

          <form action="#" onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
                disabled={loading} // Disable during loading
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="username"
              disabled={loading} // Disable during loading
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete={isLogin ? "current-password" : "new-password"} 
              disabled={loading} // Disable during loading
            />

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? (
                <FaSpinner className="spinner-icon" />
              ) : (
                isLogin ? "Login" : "Sign Up"
              )}
            </button>
          </form>

          <p className="auth-toggle">
            {isLogin ? "New here?" : "Already have an account?"}{" "}
            <span onClick={() => !loading && setIsLogin(!isLogin)}>
              {isLogin ? "Create an account" : "Login"}
            </span>
          </p>
        </div>

        <div className="auth-right">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="rocket-container"
          >
            <FaRocket size={80} color="white" />
            <h1 className="brand-name">EduNova</h1>
            <motion.p
              className="brand-tagline blink-text"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              “Empower Your Future with AI-Driven Learning”
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
