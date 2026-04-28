import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, apiRequest } from "../context/AuthContext";
import "./Home.css";

const CLASS_GROUPS = ["5-8", "9-10", "11-12"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const levelDesc = {
  Beginner:     "Simple language, lots of analogies, step-by-step",
  Intermediate: "Balanced depth, some technical terms explained",
  Advanced:     "Detailed, conceptual, exam-oriented",
};

export default function Home() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // Pre-fill from saved user context if available
  const [classGroup, setClassGroup] = useState(user?.classGroup || "");
  const [level, setLevel]           = useState(user?.level || "");
  const [error, setError]           = useState("");
  const [saving, setSaving]         = useState(false);

  async function handleContinue() {
    if (!classGroup || !level) { setError("Please select both your class group and level."); return; }
    setSaving(true);
    try {
      // Save context to backend so it persists across sessions
      const updated = await apiRequest("PUT", "/auth/context", { classGroup, level });
      updateUser(updated);
      navigate("/dashboard");
    } catch (e) {
      setError(e.message);
    } finally { setSaving(false); }
  }

  return (
    <div className="home">
      <div className="blob b1" /><div className="blob b2" /><div className="blob b3" />

      <div className="home-inner">
        <div className="home-badge">
          <span className="dot" />
          AI-powered study companion
        </div>

        <h1 className="home-heading">
          {user?.name ? `Hey ${user.name.split(" ")[0]}! 👋` : "Study smarter,"}<br />
          <span className="accent">{user?.name ? "Let's set up your profile" : "not harder"}</span>
        </h1>

        <p className="home-sub">
          Choose your class and understanding level — LearnMate will personalise
          all explanations, notes and quizzes just for you.
        </p>

        <div className="selector-card">
          <p className="selector-label">
            {user?.classGroup ? "Update your learning profile" : "Set up your learning profile"}
          </p>

          {/* Class group */}
          <div className="selector-section">
            <p className="selector-section-title">Select your class group</p>
            <div className="chips-row">
              {CLASS_GROUPS.map(g => (
                <button key={g}
                  className={`chip ${classGroup === g ? "chip-active" : ""}`}
                  onClick={() => { setClassGroup(g); setError(""); }}>
                  Class {g}
                </button>
              ))}
            </div>
          </div>

          {/* Level */}
          <div className="selector-section">
            <p className="selector-section-title">Select your understanding level</p>
            <div className="level-options">
              {LEVELS.map(l => (
                <button key={l}
                  className={`level-option ${level === l ? "level-active" : ""}`}
                  onClick={() => { setLevel(l); setError(""); }}>
                  <div className="level-top">
                    <span className="level-name">{l}</span>
                    {level === l && <span className="level-check">✓</span>}
                  </div>
                  <p className="level-desc">{levelDesc[l]}</p>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="selector-error">{error}</p>}

          <button className="continue-btn" onClick={handleContinue} disabled={saving}>
            {saving ? <><span className="spinner" /> Saving…</> : <>Continue →</>}
          </button>
        </div>

        <div className="features-strip">
          {[
            { icon: "💡", label: "Topic Explanations" },
            { icon: "📝", label: "Smart Notes" },
            { icon: "🎯", label: "Practice Quizzes" },
            { icon: "🤔", label: "Doubt Resolver" },
          ].map(f => (
            <div key={f.label} className="feature-pill">
              <span>{f.icon}</span><span>{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
