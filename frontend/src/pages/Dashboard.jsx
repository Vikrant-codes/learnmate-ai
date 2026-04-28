import { useNavigate } from "react-router-dom";
// import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/AppLayout";
import "./Dashboard.css";

const modules = [
  {
    path: "/explain",
    icon: "💡",
    title: "Explain a Topic",
    desc: "Get a structured, step-by-step explanation of any topic with real-life analogies.",
    color: "#4741D4",
    bg: "#EEEDFE",
  },
  {
    path: "/notes",
    icon: "📝",
    title: "Generate Notes",
    desc: "Instantly create concise, exam-ready bullet-point notes for quick revision.",
    color: "#16a34a",
    bg: "#dcfce7",
  },
  {
    path: "/quiz",
    icon: "🎯",
    title: "Take a Quiz",
    desc: "Test your understanding with AI-generated MCQs tailored to your class and level.",
    color: "#b45309",
    bg: "#fef3c7",
  },
];

export default function Dashboard() {
  // const { student } = useApp();
  const { user } = useAuth();
  const student = { classGroup: user?.classGroup, level: user?.level };

  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="dashboard">
        <div className="dash-header">
          <div>
            <h1 className="dash-title">Welcome back 👋</h1>
            <p className="dash-sub">
              You're set up for <strong>Class {student.classGroup}</strong> at <strong>{student.level}</strong> level.
              What would you like to do today?
            </p>
          </div>
        </div>

        <div className="dash-grid">
          {modules.map((m, i) => (
            <button
              key={m.path}
              className="dash-card"
              style={{ animationDelay: `${i * 0.08}s` }}
              onClick={() => navigate(m.path)}
            >
              <div className="dash-card-icon" style={{ background: m.bg, color: m.color }}>
                {m.icon}
              </div>
              <div className="dash-card-body">
                <h2 className="dash-card-title">{m.title}</h2>
                <p className="dash-card-desc">{m.desc}</p>
              </div>
              <div className="dash-card-arrow" style={{ color: m.color }}>→</div>
            </button>
          ))}
        </div>

        <div className="dash-tip">
          <span className="tip-icon">💬</span>
          <p>
            <strong>Tip:</strong> Start by explaining a topic you're currently studying,
            then generate notes and test yourself with a quiz!
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
