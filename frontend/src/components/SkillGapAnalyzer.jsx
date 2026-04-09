import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { 
  Target, UploadCloud, ChevronRight, Loader2, 
  AlertCircle, CheckCircle2, PartyPopper, X, Zap, Activity
} from "lucide-react";
import "../style/SkillGap.css";

// 🚀 FIXED: Dynamic URL to support both Production (Render) and Local Development
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://edunova-backend-fypl.onrender.com";

const SkillGapAnalyzer = ({ user }) => {
  const [jd, setJd] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [statusIndex, setStatusIndex] = useState(0);

  const textareaRef = useRef(null);
  const resultsRef = useRef(null);

  const loadingMessages = [
    "Mapping your technical stack against industry demands...",
    "Identifying critical skill overlaps and missing links...",
    "Analyzing market trends for your specific job role...",
    "Weighting core competencies against peer benchmarks...",
    "Cross-referencing your profile with high-demand certifications...",
    "Isolating emerging technologies you should learn next...",
    "Quantifying the distance between your profile and your dream role...",
    "Projecting career growth based on your current expertise...",
    "Generating a roadmap for your next professional upskill...",
    "Finalizing your personalized skill-readiness dashboard..."
  ];

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setStatusIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2200);
    } else {
      setStatusIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (result && resultsRef.current) {
      const score = parseFloat(result.match_score) || 0;
      if (score < 90) {
        const scrollTimeout = setTimeout(() => {
          if (resultsRef.current) {
            resultsRef.current.scrollIntoView({ 
              behavior: "smooth", 
              block: "center" 
            });
          }
        }, 150);
        return () => clearTimeout(scrollTimeout);
      }
    }
  }, [result]);

  const highlightTech = (text) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.map((word, i) => {
      const isTech = /^[A-Z]/.test(word) || word.includes('.') || word.includes('/');
      return (
        <span key={i} className={isTech ? "highlight-word" : ""}>
          {word}{" "}
        </span>
      );
    });
  };

  const handleAnalyze = async () => {
    if (!resume || !jd.trim()) {
      setError("Please provide both a Job Description and your Resume.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("job_description", jd);

    const profile = {
      name: user?.name || "Student",
      skills: user?.customSkills?.map((s) => s.name) || [],
      academics: user?.degree ? `${user.degree}, Year ${user.currentYear}` : "Not provided",
    };
    formData.append("profile_json", JSON.stringify(profile));

    try {
      // ✅ CHANGED: Now calling the hosted API_BASE_URL instead of localhost
      const res = await axios.post(`${API_BASE_URL}/api/ai/skill-gap`, formData);
      let data = res.data;

      if (typeof data.missing_skills === "string") {
        const lines = data.missing_skills.split("\n").map(l => l.trim()).filter(Boolean);
        let extracted = lines.map(line => {
            let clean = line.replace(/^[-*•\d.]+\s*/, "").trim();
            const boldMatch = clean.match(/\*\*(.*?)\*\*/);
            let skill = boldMatch ? boldMatch[1] : clean.split(/[(\-]/)[0];
            return skill.replace(/[()]/g, '').trim(); 
        });
        data.missing_skills = extracted.filter(s => s.length > 2);
      }
      setResult(data);
    } catch (err) {
      console.error("Diagnostic error:", err);
      setError("Diagnostic analysis failed. Check your connection to the AI service.");
    } finally {
      setLoading(false);
    }
  };

  const clearResult = () => setResult(null);
  const scoreValue = result ? parseFloat(result.match_score) : 0;
  const isPerfect = scoreValue >= 90;

  return (
    <div className="edu-sg-scope">
      <div className="sg-wrapper">
        
        {isPerfect && (
          <div className="sg-success-overlay">
            <div className="sg-success-modal animate-popIn">
              <button className="sg-modal-close" onClick={clearResult}><X size={24}/></button>
              <div className="sg-success-icon-wrap">
                <PartyPopper size={48} className="icon-gold" />
              </div>
              <div className="sg-success-content">
                <div className="sg-badge-premium">Nova Certified Match</div>
                <h2 className="text-glass-heavy">Exceptional Fit!</h2>
                <p>Your expertise aligns perfectly with this role. You are in the <strong>top 1%</strong> of candidates.</p>
                <div className="sg-perfect-score">
                  <span className="score-num">{result.match_score}</span>
                  <Zap size={24} className="icon-bolt" />
                </div>
                <div className="sg-modal-actions">
                  <button className="btn-secondary-nova" onClick={clearResult}>Analyze Another</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <main className="sg-card">
          <header className="sg-header-v2">
            <div className="sg-badge">EDUNOVA AI LABS</div>
            <h1 className="sg-title">
              Skill-Gap <span className="sg-gradient-text">Analyzer</span>
            </h1>
            <p className="sg-subtitle">Identify critical deficiencies between your profile and target roles.</p>
          </header>

          <div className="sg-body">
            <section className="sg-workspace-card">
              <div className="sg-input-grid">
                
                <div className="input-group">
                  <div className={`sg-upload-zone ${resume ? 'active' : ''} ${loading ? 'scanning' : ''}`}>
                    <input 
                      type="file" 
                      id="sg-file-upload"
                      onChange={(e) => setResume(e.target.files[0])} 
                      accept=".pdf,.docx"
                      hidden
                    />
                    <label htmlFor="sg-file-upload" className="sg-upload-label">
                      {resume ? (
                        <CheckCircle2 size={40} className="text-success" />
                      ) : (
                        <UploadCloud size={40} className="icon-tech" />
                      )}
                      <span className="file-name-main">
                        {resume ? resume.name : "Target Resume (PDF)"}
                      </span>
                      {loading && <div className="scanner-line"></div>}
                    </label>
                  </div>
                </div>

                <div className="input-group">
                  <textarea
                    ref={textareaRef}
                    className="sg-jd-area"
                    placeholder="Paste Job Description / Technical Requirements here..."
                    value={jd}
                    onChange={(e) => setJd(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <button className="sg-analyze-btn" onClick={handleAnalyze} disabled={loading}>
                {loading ? <Loader2 className="spin" size={20} /> : <><Activity size={20} /> Initialize Diagnostic</>}
              </button>
            </section>

            {loading && (
              <div className="sg-status-box animate-popIn">
                <Zap size={18} className="pulse-icon" />
                <p>{loadingMessages[statusIndex]}</p>
              </div>
            )}

            {error && (
              <div className="error-box animate-popIn">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {result && !isPerfect && (
              <section ref={resultsRef} className="sg-report-container animate-popIn">
                <div className="report-header">
                  <span className="report-tag">DIAGNOSTIC REPORT</span>
                </div>
                
                <div className="report-layout">
                  <div className="report-summary-box">
                    <h3 className="section-subtitle">AI Executive Summary</h3>
                    <div className="ai-description-text">
                      {highlightTech(result.analysis_summary || "Scanning complete.")}
                    </div>
                  </div>

                  <div className="report-metrics-box">
                    <div className="score-overview-v2">
                      <div className="score-circle-mini">
                        <span className="score-val">{result.match_score}</span>
                        <span className="score-label">Ready</span>
                      </div>
                      <div className="progress-stack">
                        <span className="progress-label">Readiness Score</span>
                        <div className="sg-bar-bg-mini">
                          <div className="sg-bar-fill-mini" style={{ width: `${result.match_score}%` }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="gaps-container-v2">
                      <h3 className="section-subtitle">Missing Tech Stack</h3>
                      <div className="skills-tag-grid">
                        {result.missing_skills?.length > 0 ? (
                          result.missing_skills.map((skill, i) => (
                            <div key={i} className="skill-tag">
                              <ChevronRight size={12} className="tag-icon" />
                              <span className="tag-text">{highlightTech(skill)}</span>
                            </div>
                          ))
                        ) : (
                          <div className="empty-state">
                            <CheckCircle2 size={20} className="text-success" />
                            Ready to Apply!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SkillGapAnalyzer;
