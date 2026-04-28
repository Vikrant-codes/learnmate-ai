import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/AppLayout";
import { api } from "../utils/api";
import "./Quiz.css";

const SUBJECTS = ["Mathematics","Science","Physics","Chemistry","Biology","History","Geography","English","Economics","Computer Science","Social Studies","Other"];

const PHASE = { SETUP: "setup", QUIZ: "quiz", RESULT: "result" };

export default function Quiz() {
  const { user } = useAuth();
  const student = { classGroup: user?.classGroup, level: user?.level };

  const [subject, setSubject]     = useState("");
  const [topic, setTopic]         = useState("");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [phase, setPhase]         = useState(PHASE.SETUP);
  const [questions, setQuestions] = useState([]);   // parsed MCQs
  const [selected, setSelected]   = useState({});   // { [qIndex]: optionLetter }
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore]         = useState(0);

  /* ── Generate quiz ── */
  async function handleGenerate() {
    if (!subject || !topic.trim()) { setError("Please select a subject and enter a topic."); return; }
    setError(""); setLoading(true);
    try {
      const data = await api.quiz({ subject, topic, classGroup: student.classGroup, level: student.level });
      const parsed = parseQuiz(data.result);
      if (!parsed.length) throw new Error("Could not parse quiz. Please try again.");
      setQuestions(parsed);
      setSelected({});
      setSubmitted(false);
      setScore(0);
      setPhase(PHASE.QUIZ);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }

  /* ── Submit answers ── */
  function handleSubmit() {
    if (Object.keys(selected).length < questions.length) {
      setError("Please answer all questions before submitting."); return;
    }
    let correct = 0;
    questions.forEach((q, i) => {
      if (selected[i]?.toUpperCase() === q.answer?.toUpperCase()) correct++;
    });
    setScore(correct);
    setSubmitted(true);
    setPhase(PHASE.RESULT);
    setError("");
  }

  /* ── Reset ── */
  function handleRetry() {
    setPhase(PHASE.SETUP);
    setQuestions([]);
    setSelected({});
    setSubmitted(false);
    setScore(0);
    setError("");
  }

  const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const grade = pct >= 80 ? "Excellent" : pct >= 60 ? "Good" : pct >= 40 ? "Keep Practicing" : "Needs Improvement";
  const gradeColor = pct >= 80 ? "var(--green-dark)" : pct >= 60 ? "var(--brand)" : pct >= 40 ? "var(--amber)" : "var(--red)";
  const gradeBg    = pct >= 80 ? "var(--green-light)" : pct >= 60 ? "var(--brand-light)" : pct >= 40 ? "var(--amber-light)" : "var(--red-light)";

  return (
    <AppLayout>
      <div className="quiz-page">

        {/* ── SETUP ── */}
        {phase === PHASE.SETUP && (
          <div className="quiz-setup-wrap">
            <div className="quiz-setup-card">
              <div className="page-header">
                <span className="page-icon">🎯</span>
                <div>
                  <h1 className="page-title">Quiz Generator</h1>
                  <p className="page-sub">5–7 MCQs tailored to your class and level</p>
                </div>
              </div>

              <div className="field">
                <label className="field-label">Subject</label>
                <div className="subject-grid">
                  {SUBJECTS.map(s => (
                    <button key={s} className={`subj-chip ${subject===s?"subj-active":""}`}
                      onClick={()=>{setSubject(s);setError("");}}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Topic</label>
                <input className="text-input" placeholder="e.g. Quadratic Equations, World War II..."
                  value={topic} onChange={e=>{setTopic(e.target.value);setError("");}} />
              </div>

              <div className="quiz-info-row">
                <div className="quiz-info-pill">Class {student.classGroup}</div>
                <div className="quiz-info-pill">{student.level} Level</div>
                <div className="quiz-info-pill">5–7 Questions</div>
              </div>

              {error && <p className="form-error">{error}</p>}

              <button className="btn-amber" onClick={handleGenerate} disabled={loading}>
                {loading
                  ? <><span className="spinner" /> Generating Quiz…</>
                  : "Generate Quiz →"}
              </button>
            </div>
          </div>
        )}

        {/* ── QUIZ ── */}
        {phase === PHASE.QUIZ && (
          <div className="quiz-active-wrap">
            <div className="quiz-top-bar">
              <div>
                <h2 className="quiz-active-title">{subject} — {topic}</h2>
                <p className="quiz-active-sub">Class {student.classGroup} · {student.level} · {questions.length} questions</p>
              </div>
              <div className="quiz-progress-label">
                {Object.keys(selected).length}/{questions.length} answered
              </div>
            </div>

            <div className="questions-list">
              {questions.map((q, qi) => (
                <div key={qi} className="question-card">
                  <p className="question-text">
                    <span className="question-num">Q{qi+1}.</span> {q.question}
                  </p>
                  <div className="options-grid">
                    {q.options.map((opt) => {
                      const letter = opt.charAt(0);
                      const isSelected = selected[qi] === letter;
                      return (
                        <button key={letter}
                          className={`option-btn ${isSelected ? "option-selected" : ""}`}
                          onClick={() => { setSelected(s => ({...s, [qi]: letter})); setError(""); }}>
                          <span className="option-letter">{letter}</span>
                          <span className="option-text">{opt.slice(3)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {error && <p className="form-error" style={{marginTop:"1rem"}}>{error}</p>}

            <div className="quiz-submit-bar">
              <button className="btn-ghost" onClick={handleRetry}>← New Quiz</button>
              <button className="btn-amber" onClick={handleSubmit}>
                Submit Answers →
              </button>
            </div>
          </div>
        )}

        {/* ── RESULT ── */}
        {phase === PHASE.RESULT && (
          <div className="quiz-result-wrap">
            {/* score card */}
            <div className="score-card">
              <div className="score-circle-wrap">
                <div className="score-circle" style={{ background: gradeBg, borderColor: gradeColor }}>
                  <span className="score-num" style={{ color: gradeColor }}>{score}/{questions.length}</span>
                  <span className="score-pct" style={{ color: gradeColor }}>{pct}%</span>
                </div>
              </div>
              <h2 className="score-grade" style={{ color: gradeColor }}>{grade}!</h2>
              <p className="score-sub">
                You got <strong>{score}</strong> out of <strong>{questions.length}</strong> questions correct.
              </p>
              <div className="score-bar-wrap">
                <div className="score-bar" style={{ width: `${pct}%`, background: gradeColor }} />
              </div>
              <button className="btn-primary retry-btn" onClick={handleRetry}>Try Another Quiz</button>
            </div>

            {/* answer review */}
            <div className="review-section">
              <h3 className="review-title">Answer Review</h3>
              {questions.map((q, qi) => {
                const userAns = selected[qi]?.toUpperCase();
                const correct = q.answer?.toUpperCase();
                const isCorrect = userAns === correct;
                return (
                  <div key={qi} className={`review-card ${isCorrect ? "review-correct" : "review-wrong"}`}>
                    <div className="review-top">
                      <span className={`review-badge ${isCorrect ? "badge-correct" : "badge-wrong"}`}>
                        {isCorrect ? "✓ Correct" : "✗ Wrong"}
                      </span>
                      <span className="review-qnum">Q{qi+1}</span>
                    </div>
                    <p className="review-question">{q.question}</p>
                    <div className="review-answers">
                      {!isCorrect && (
                        <p className="review-user-ans">Your answer: <strong>{userAns}</strong></p>
                      )}
                      <p className="review-correct-ans">Correct answer: <strong>{correct}</strong></p>
                    </div>
                    {q.explanation && (
                      <p className="review-explanation">💡 {q.explanation}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}

/* ────────────────────────────────────────────
   Parse AI response into structured questions
   Expected format from backend:
   Q1. Question text
   A) Option 1
   B) Option 2
   C) Option 3
   D) Option 4
   Answer: B
   Explanation: ...
──────────────────────────────────────────── */
function parseQuiz(raw) {
  const questions = [];
  // Split by question blocks
  const blocks = raw.split(/\n(?=Q\d+[\.\)])/i).filter(Boolean);

  for (const block of blocks) {
    const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
    if (!lines.length) continue;

    const qLine = lines[0].replace(/^Q\d+[\.\)]\s*/i, "").trim();
    const options = lines.filter(l => /^[A-D][\.\)]/i.test(l));
    const answerLine = lines.find(l => /^answer\s*:/i.test(l));
    const explanationLine = lines.find(l => /^explanation\s*:/i.test(l));

    const answer = answerLine ? answerLine.replace(/^answer\s*:\s*/i, "").trim().charAt(0).toUpperCase() : "";
    const explanation = explanationLine ? explanationLine.replace(/^explanation\s*:\s*/i, "").trim() : "";

    if (qLine && options.length >= 2) {
      questions.push({ question: qLine, options, answer, explanation });
    }
  }
  return questions;
}
