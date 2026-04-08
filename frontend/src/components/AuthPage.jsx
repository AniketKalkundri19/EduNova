// src/components/AuthPage.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast"; 
import { FaRocket } from "react-icons/fa";
import "../style/AuthPage.css";

const AuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(false);
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

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Authentication failed!");
        return;
      }

      toast.success(data.message);

      // ✅ 1. SAVE USER ID, NAME, & JWT TOKEN
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("userName", data.user.name); // 🔑 THIS FIXES THE "GUEST" BUG
      
      if (data.token) {
        localStorage.setItem("edu_token", data.token);
      }

      // ✅ 2. THE GOOGLE PASSWORD MANAGER TRIGGER
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

      // ✅ 3. THE 400ms DELAY (Prevents React from destroying the form too fast)
      setTimeout(() => {
        onAuthSuccess({
          ...data.user,
          isNewUser: !isLogin, 
        });
      }, 400);

    } catch (error) {
      toast.error("Server error. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* LEFT */}
        <div className="auth-left">
          <h2 className="auth-title">
            {isLogin ? "Welcome Back 👋" : "Join EduNova 🚀"}
          </h2>

          <p className="auth-subtitle">
            {isLogin
              ? "Login to access your personalized student dashboard."
              : "Create your account and unlock smart AI-powered learning!"}
          </p>

          {/* Added action="#" as a fallback for strict browsers */}
          <form action="#" onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name" // Let browser know this is a name field
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="username" // Crucial: Tells the browser this is the login ID
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              // Crucial: Differentiates between updating an old password vs making a new one
              autoComplete={isLogin ? "current-password" : "new-password"} 
            />

            <button type="submit" className="auth-button">
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <p className="auth-toggle">
            {isLogin ? "New here?" : "Already have an account?"}{" "}
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Create an account" : "Login"}
            </span>
          </p>
        </div>

        {/* RIGHT */}
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