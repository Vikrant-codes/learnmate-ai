import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/AppLayout";
import { api } from "../utils/api";
import "./Notes.css";

const SUBJECTS = ["Mathematics","Science","Physics","Chemistry","Biology","History","Geography","English","Economics","Computer Science","Social Studies","Other"];

export default function Notes() {
  const { user } = useAuth();
  const student = { classGroup: user?.classGroup, level: user?.level };  
  
  const [subject, setSubject]   = useState("");
  const [topic, setTopic]       = useState("");
  const [notes, setNotes]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  async function handleGenerate() {
    if (!subject || !topic.trim()) { setError("Please select a subject and enter a topic."); return; }
    setError(""); setNotes(""); setLoading(true);
    try {
      const data = await api.notes({ subject, topic, classGroup: student.classGroup, level: student.level });
      setNotes(data.result);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }

  function handleCopy() {
    navigator.clipboard.writeText(notes);
  }

  return (
    <AppLayout>
      <div className="notes-page">
        <div className="notes-panel">
          <div className="page-header">
            <span className="page-icon">📝</span>
            <div>
              <h1 className="page-title">Notes Generator</h1>
              <p className="page-sub">Concise, exam-ready bullet notes in seconds</p>
            </div>
          </div>

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

          <div className="field">
            <label className="field-label">Topic</label>
            <input
              className="text-input"
              placeholder="e.g. Laws of Motion, The French Revolution..."
              value={topic}
              onChange={e=>{setTopic(e.target.value);setError("");}}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button className="btn-green" onClick={handleGenerate} disabled={loading}>
              {loading ? <><span className="spinner" /> Generating Notes…</> : "Generate Notes"}
            </button>
            {notes && <button className="btn-ghost" onClick={handleCopy}>Copy</button>}
          </div>
        </div>

        {/* notes output */}
        <div className="notes-output">
          {!notes && !loading && (
            <div className="output-empty">
              <span className="empty-icon">📝</span>
              <p>Your notes will appear here</p>
              <p className="empty-sub">Formatted for quick revision and exam prep</p>
            </div>
          )}
          {loading && (
            <div className="output-loading">
              <span className="spinner dark" />
              <p>Generating notes for Class {student.classGroup}…</p>
            </div>
          )}
          {notes && (
            <div className="output-content">
              <div className="notes-header-bar">
                <div className="output-meta">
                  <span className="output-tag output-tag-green">{subject}</span>
                  <span className="output-tag output-tag-green">{topic}</span>
                </div>
                <button className="copy-btn" onClick={handleCopy} title="Copy notes">
                  📋 Copy
                </button>
              </div>
              <div className="md-output">
                <ReactMarkdown>{notes}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
