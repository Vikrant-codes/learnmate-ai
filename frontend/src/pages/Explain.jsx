import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/AppLayout";
import { api } from "../utils/api";
import "./Explain.css";

const SUBJECTS = ["Mathematics","Science","Physics","Chemistry","Biology","History","Geography","English","Economics","Computer Science","Social Studies","Other"];

export default function Explain() {
  const { user } = useAuth();
  const student = { classGroup: user?.classGroup, level: user?.level };

  const [subject, setSubject]     = useState("");
  const [topic, setTopic]         = useState("");
  const [doubt, setDoubt]         = useState("");
  const [mode, setMode]           = useState("explain"); // "explain" | "doubt"
  const [response, setResponse]   = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  async function handleSubmit() {
    if (!subject || !topic.trim()) { setError("Please select a subject and enter a topic."); return; }
    if (mode === "doubt" && !doubt.trim()) { setError("Please enter your doubt."); return; }
    setError(""); setResponse(""); setLoading(true);
    try {
      const endpoint = mode === "explain" ? api.explain : api.doubt;
      const body = { subject, topic, classGroup: student.classGroup, level: student.level, ...(mode === "doubt" && { doubt }) };
      const data = await endpoint(body);
      setResponse(data.result);
      // setCurrentTopic(topic);
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  }

  function handleClear() { setResponse(""); setDoubt(""); setError(""); }

  return (
    <AppLayout>
      <div className="explain-page">
        {/* left panel */}
        <div className="explain-panel">
          <div className="page-header">
            <span className="page-icon">💡</span>
            <div>
              <h1 className="page-title">Explain & Resolve</h1>
              <p className="page-sub">Get explanations or clear a specific doubt</p>
            </div>
          </div>

          {/* mode toggle */}
          <div className="mode-toggle">
            <button className={`mode-btn ${mode==="explain"?"mode-active":""}`} onClick={()=>setMode("explain")}>
              Explain Topic
            </button>
            <button className={`mode-btn ${mode==="doubt"?"mode-active":""}`} onClick={()=>setMode("doubt")}>
              Resolve Doubt
            </button>
          </div>

          {/* subject */}
          <div className="field">
            <label className="field-label">Subject</label>
            <div className="subject-grid">
              {SUBJECTS.map(s => (
                <button key={s} className={`subj-chip ${subject===s?"subj-active":""}`} onClick={()=>{setSubject(s);setError("");}}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* topic */}
          <div className="field">
            <label className="field-label">Topic Name</label>
            <input
              className="text-input"
              placeholder="e.g. Photosynthesis, Pythagoras Theorem..."
              value={topic}
              onChange={e=>{setTopic(e.target.value);setError("");}}
            />
          </div>

          {/* doubt (conditional) */}
          {mode === "doubt" && (
            <div className="field">
              <label className="field-label">Your Doubt</label>
              <textarea
                className="text-area"
                placeholder="e.g. Why does light bend when it enters water?"
                rows={3}
                value={doubt}
                onChange={e=>{setDoubt(e.target.value);setError("");}}
              />
            </div>
          )}

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? <><span className="spinner" /> Generating...</> : (mode==="explain" ? "Explain Topic" : "Resolve Doubt")}
            </button>
            {response && <button className="btn-ghost" onClick={handleClear}>Clear</button>}
          </div>
        </div>

        {/* right panel — response */}
        <div className="explain-output">
          {!response && !loading && (
            <div className="output-empty">
              <span className="empty-icon">💡</span>
              <p>Your explanation will appear here</p>
              <p className="empty-sub">Select a subject, enter a topic, and hit the button</p>
            </div>
          )}
          {loading && (
            <div className="output-loading">
              <span className="spinner dark" />
              <p>Generating explanation for Class {student.classGroup} — {student.level} level…</p>
            </div>
          )}
          {response && (
            <div className="output-content">
              <div className="output-meta">
                <span className="output-tag">{subject}</span>
                <span className="output-tag">{topic}</span>
                <span className="output-tag-level">{student.level}</span>
              </div>
              <div className="md-output">
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
