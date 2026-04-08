import React, { useState, useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { 
  Sparkles, Download, UploadCloud, Info, 
  ArrowRightLeft, Loader2, CheckCircle2, Wand2, FileText
} from "lucide-react";
import { enhanceResumeService } from "../services/resumeService";
import "../style/ResumeEnhancer.css";

const ResumeEnhancer = ({ user }) => {
  const { darkMode } = useContext(ThemeContext);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);

  const resultsRef = useRef(null);

  const loadingMessages = [
    "Decoding your career milestones for maximum recruiter impact...",
    "Aligning your core competencies with current industry benchmarks...",
    "Scrubbing generic phrases to make room for powerful success metrics...",
    "Benchmarking your skills against top-tier candidate profiles...",
    "Restructuring your narrative to pass the '6-second' recruiter glance...",
    "Synthesizing your experience into a high-conversion professional summary...",
    "Calibrating keyword density to boost your ATS ranking score...",
    "Refining your layout to ensure a seamless visual hierarchy...",
    "Translating your responsibilities into measurable achievements...",
    "Conducting a final audit for tone, clarity, and professional edge..."
  ];

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setStatusIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
    } else {
      setStatusIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (result && resultsRef.current) {
      const scrollTimeout = setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 200);
      return () => clearTimeout(scrollTimeout);
    }
  }, [result]);

  const handleEnhance = async () => {
    if (!resumeFile || !jobDescription.trim()) return alert("Please provide both Resume and JD.");
    try {
      setLoading(true);
      setResult(null);
      const response = await enhanceResumeService(resumeFile, jobDescription.trim(), user);
      setResult(response.data || response);
    } catch (error) {
      alert("AI Enhancement failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    
    // Temporarily change document title to force custom PDF filename
    const originalTitle = document.title;
    const originalName = resumeFile ? resumeFile.name.replace(/\.[^/.]+$/, "") : "Optimized";
    document.title = `EduNova_${originalName}`;
    
    window.print();
    
    // Restore title
    document.title = originalTitle;
  };

  return (
    <div className={`edu-resume-scope ${darkMode ? "dark" : ""}`}>
      
      {/* =========================================================
          SCREEN UI: The Interactive Workspace (Hidden during print)
          ========================================================= */}
      <div className="resume-page-container hide-on-print">
        
        <header className="resume-header-section">
          <div className="header-badge-pill">EDUNOVA AI LABS</div>
          <h1 className="resume-main-title">
            Resume <span className="text-gradient-magic">Enhancer</span>
          </h1>
          <p className="resume-sub-text">Rewrite and elevate your professional experience using context-aware AI.</p>
        </header>

        <main className="resume-workspace-card">
          <div className="input-flex-group">
            
            <div className="input-column">
              <label className="section-label">1. Upload Current Resume</label>
              <div className={`upload-drop-zone ${resumeFile ? "active" : ""}`}>
                <input 
                  type="file" id="resume-upload-input" hidden accept=".pdf,.docx" 
                  onChange={(e) => setResumeFile(e.target.files[0])} 
                />
                <label htmlFor="resume-upload-input" className="upload-inner-label">
                  {resumeFile ? (
                    <CheckCircle2 size={40} className="text-success" />
                  ) : (
                    <UploadCloud size={40} className="icon-primary" />
                  )}
                  <span className="file-name">{resumeFile ? resumeFile.name : "Select PDF or DOCX"}</span>
                  {!resumeFile && <span className="file-hint">Drag & drop or click to browse</span>}
                </label>
              </div>
            </div>
            
            <div className="input-column">
              <label className="section-label">2. Target Job Description</label>
              <textarea
                className="jd-input-area"
                placeholder="Paste the requirements or description of the job you are applying for..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={loading}
              />
            </div>

          </div>

          <button onClick={handleEnhance} disabled={loading} className="enhance-action-btn">
            {loading ? (
              <Loader2 className="spin" size={20} />
            ) : (
              <><Sparkles size={18} /> Generate AI Profile Audit</>
            )}
          </button>
        </main>

        {loading && (
          <div className="re-status-box animate-popIn">
            <div className="status-icon-ring">
              <Wand2 size={20} className="pulse-icon text-magic" />
            </div>
            <div className="status-text-content">
              <p className="status-primary">{loadingMessages[statusIndex]}</p>
              <div className="re-progress-bar"><div className="re-progress-fill"></div></div>
            </div>
          </div>
        )}

        {result && (
          <div ref={resultsRef} className="comparison-view-container animated-fade-in">
            <div className="comparison-header-bar">
              <div className="view-title">
                <ArrowRightLeft size={24} className="text-magic" />
                <h2>Optimization Comparison</h2>
              </div>
              <button onClick={handleDownload} className="download-btn-premium">
                <Download size={18} /> Export PDF
              </button>
            </div>
            
            <div className="comparison-table">
               <div className="table-header">
                  <div className="header-tag"><FileText size={16}/> Original Draft</div>
                  <div className="header-tag ai"><Sparkles size={16}/> Optimized Version</div>
               </div>

               {result.enhanced_sections?.map((section, i) => (
                 <div key={i} className="comparison-row">
                    <div className="panel-side original">
                       <div className="text-content">{section.original}</div>
                    </div>
                    
                    <div className="panel-side enhanced">
                       <div className="text-content">
                          {section.enhanced}
                          {section.reasoning && (
                            <div className="insight-tooltip-trigger">
                              <Info size={16} />
                              <div className="tooltip-popup">
                                <strong>AI Insight:</strong> {section.reasoning}
                              </div>
                            </div>
                          )}
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================
          PRINT UI: EduNova Branded Report (Strictly Hidden on Screen)
          ========================================================= */}
      {result && (
        <div className="ats-print-container" style={{ display: "none" }}>
          
          <div className="print-brand-header">
            <h2>EDUNOVA AI LABS</h2>
            <p>Optimization Report & ATS Enhancements</p>
          </div>

          <div className="ats-header">
            <h1 className="ats-name">{user?.name || "Candidate Profile"}</h1>
          </div>

          <div className="ats-section">
            <h2 className="ats-section-title">AI Optimized Experience</h2>
            <p className="print-disclaimer">The following bullet points have been algorithmically enhanced for maximum ATS compatibility and impact.</p>
            
            <div className="ats-item">
              <ul className="ats-bullet-list">
                {result.enhanced_sections?.map((section, i) => (
                  <li key={i} className="print-bullet-item">
                    <span className="print-enhanced-text"><strong>Optimized:</strong> {section.enhanced}</span>
                    {section.reasoning && (
                      <span className="print-reasoning">AI Insight: {section.reasoning}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="print-footer">
            <p>© {new Date().getFullYear()} EduNova AI Labs. All rights reserved. Document generated securely via EduNova Resume Architect.</p>
          </div>

        </div>
      )}

    </div>
  );
};

export default ResumeEnhancer;