import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

const links = [
  { path: "/dashboard",  label: "Dashboard",   icon: "⊞" },
  { path: "/explain",    label: "Explain Topic",icon: "💡" },
  { path: "/notes",      label: "Notes",        icon: "📝" },
  { path: "/quiz",       label: "Quiz",         icon: "🎯" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {links.map((l) => (
          <button
            key={l.path}
            className={`sidebar-link ${pathname === l.path ? "active" : ""}`}
            onClick={() => navigate(l.path)}
          >
            <span className="sidebar-icon">{l.icon}</span>
            <span>{l.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p className="sidebar-footer-text">LearnMate v1.0</p>
        <p className="sidebar-footer-sub">AI Study Companion</p>
      </div>
    </aside>
  );
}
