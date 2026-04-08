import React, { useState, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import SkillGapAnalyzer from "./components/SkillGapAnalyzer";
import ResumeEnhancer from "./components/ResumeEnhancer";
import StudentDetailsForm from "./components/StudentDetailForm";
import NovaBot from "./components/Novabot";
import AuthPage from "./components/AuthPage";
import Landing from "./components/Landing";
import Profile from "./components/Profile";
import About from "./components/About";

import "./style/styles.css";
import "./style/Dashboard.css";


/* ================= TRANSITION COMPONENT ================= */
const PageTransition = ({ children, keyProp }) => (
  <motion.div
    key={keyProp}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    style={{ width: "100%" }}
  >
    {children}
  </motion.div>
);

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [activePage, setActivePage] = useState("Dashboard");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH STUDENT ================= */
  const fetchStudentProfile = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/student/${userId}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Fetch failed");
      return await res.json();
    } catch {
      return null;
    }
  };

  /* ================= INIT ================= */
  /* ================= INIT (AUTO-LOGIN) ================= */
  useEffect(() => {
    const checkAuthStatus = async () => {
      const savedToken = localStorage.getItem("edu_token");
      const savedUserId = localStorage.getItem("userId");
      const savedUserName = localStorage.getItem("userName"); // 🔑 Grab the name!

      if (savedToken && savedUserId) {
        try {
          const student = await fetchStudentProfile(savedUserId);

          if (student) {
            // 🔑 Inject the savedUserName here
            setUserDetails({ id: savedUserId, name: savedUserName, ...student, isNewUser: false });
          } else {
            // 🔑 Inject the savedUserName here too
            setUserDetails({ id: savedUserId, name: savedUserName, isNewUser: true });
          }

          setIsAuthenticated(true);
          setShowLanding(false); 
        } catch (error) {
          console.error("Auto-login failed:", error);
          localStorage.removeItem("edu_token");
          localStorage.removeItem("userId");
          localStorage.removeItem("userName"); // 🔑 clear bad data
        }
      }
      
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const handleGetStarted = () => setShowLanding(false);

  /* ================= AUTH SUCCESS ================= */
  const handleAuthSuccess = async (userData) => {
    setIsAuthenticated(true);
    localStorage.setItem("userId", userData.id);

    const student = await fetchStudentProfile(userData.id);

    if (student) {
      setUserDetails({ ...userData, ...student, isNewUser: false });
    } else {
      setUserDetails({ ...userData, isNewUser: true });
    }
  };

  /* ================= STUDENT FORM SUBMIT ================= */
  const handleProfileSubmit = (studentFromDB) => {
    setUserDetails((prev) => ({
      ...prev,
      ...studentFromDB,
      isNewUser: false,
    }));
  };

  /* ================= LOGOUT ================= */
  /* ================= LOGOUT ================= */
    const handleLogout = () => {
        localStorage.removeItem("edu_token"); // ✅ Clear token
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");    // ✅ Clear ID
        setIsAuthenticated(false);
        setUserDetails(null);
        setShowLanding(true);
        setActivePage("Dashboard");
      };

  if (loading) return null;

  /* ================= RENDER LOGIC ================= */
  const renderContent = () => {
    // 1. Handle Pre-Auth Screens (No transitions usually needed for these major shifts)
    if (showLanding) return <Landing onGetStarted={handleGetStarted} />;
    if (!isAuthenticated) return <AuthPage onAuthSuccess={handleAuthSuccess} />;
    if (userDetails?.isNewUser) return <StudentDetailsForm onSubmit={handleProfileSubmit} />;
    

    // 2. Handle Main Dashboard Navigation (With Transitions)
    return (
      <AnimatePresence mode="wait">
        <PageTransition keyProp={activePage}>
          {(() => {
            switch (activePage) {
              case "Dashboard":
                return <Dashboard user={userDetails} />;
              case "SkillGapAnalyzer":
                return <SkillGapAnalyzer user={userDetails} />;
              case "ResumeEnhancer":
                return <ResumeEnhancer user={userDetails} />;
              case "About": // ✅ ADD THIS CASE
                return <About />;
              case "Profile":
                return (
                  <Profile
                    user={userDetails}
                    onProfileUpdate={(updated) =>
                      setUserDetails((prev) => ({ ...prev, ...updated }))
                    }
                    onLogout={handleLogout}
                  />
                );
              default:
                return <Dashboard user={userDetails} />;
            }
          })()}
        </PageTransition>
      </AnimatePresence>
    );
  };

  const showFullLayout = isAuthenticated && !showLanding && !userDetails?.isNewUser;

  return (
    <ThemeProvider>
      <Toaster position="top-center" />

      <Header
        user={showFullLayout ? userDetails : null}
        onProfileClick={() => setActivePage("Profile")}
        onLogoClick={() => setActivePage("About")} // ✅ This triggers the switch
        onLogout={handleLogout}
      />

      <div className={`layout ${showFullLayout ? "full-layout" : "center-layout"}`}>
        {showFullLayout && (
          <Sidebar activePage={activePage} setActivePage={setActivePage} />
        )}
        <main className="main-content">
          {renderContent()}
          <footer className="landing-footer">
    <p>© {new Date().getFullYear()} EduNova • Empowering Students with AI</p>
  </footer>
        </main>
      </div>

      {showFullLayout && <NovaBot user={userDetails} />}


    </ThemeProvider>
  );
}

export default App;