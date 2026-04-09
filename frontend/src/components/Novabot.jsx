import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaRobot, FaTimes } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

// 🚀 FIXED: Dynamic URL for Production
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://edunova-backend-fypl.onrender.com";

const NovaBot = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, open]);

  /* ================= CLEANUP ================= */
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading || !user) return;

    const safeSkills = Array.isArray(user.customSkills)
      ? user.customSkills.map((s) => s.name)
      : [];

    const safeProjects = Array.isArray(user.projects)
      ? user.projects.map((p) => p.title)
      : [];

    const profileData = {
      degree: user.degree || "Not set",
      currentYear: user.currentYear || "Not set",
      cgpa: user.cgpa || "N/A",
      skills: safeSkills,
      projects: safeProjects,
    };

    const userMessage = { from: "user", text: input.trim() };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      abortControllerRef.current = new AbortController();

      // ✅ CHANGED: Now using API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          name: user.name || "Student",
          profile: profileData,
          history: [...messages, userMessage].map((msg) => ({
            role: msg.from === "user" ? "user" : "assistant",
            content: msg.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error ${response.status}`);
      }

      const data = await response.json();

      if (data?.success && data?.response) {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: data.response },
        ]);
      } else {
        throw new Error(data?.error || "Invalid AI response");
      }
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error("NovaBot Error:", error.message);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "⚠️ NovaBot is temporarily unavailable. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, user, messages]);

  /* ================= UI ================= */
  return (
    <div className="novabot">
      {open ? (
        <div className="chat-window">
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaRobot />
              <span>NovaBot</span>
            </div>
            <FaTimes
              onClick={() => setOpen(false)}
              style={{ cursor: "pointer" }}
            />
          </div>

          <div className="chat-body">
            {messages.length === 0 && (
              <div className="chat-msg bot">
                Hi {user?.name?.split(" ")[0] || "Student"}! How can I help you today?
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-msg ${msg.from}`}>
                {msg.from === "bot" ? (
                  <div className="markdown-content">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            ))}

            {loading && (
              <div className="chat-msg bot">
                <div className="typing-loader">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-footer">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask me anything..."
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()}>
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="bot-tooltip">
            <span style={{ color: "#22c55e", marginRight: "5px" }}>●</span>
            NovaBot Online
          </div>
          <button className="chat-btn" onClick={() => setOpen(true)}>
            <FaRobot size={24} />
          </button>
        </>
      )}
    </div>
  );
};

export default NovaBot;
