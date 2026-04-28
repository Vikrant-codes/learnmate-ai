import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const levelColors = {
  Beginner:     { bg: "#dcfce7", color: "#16a34a" },
  Intermediate: { bg: "#fef3c7", color: "#b45309" },
  Advanced:     { bg: "#fee2e2", color: "#dc2626" },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropOpen, setDropOpen] = useState(false);

  const isHome = location.pathname === "/";
  const lc = levelColors[user?.level] || {};

  function handleLogout() {
    logout();
    navigate("/login");
    setDropOpen(false);
  }

  return (
    <nav className="navbar">
      <div
        className="navbar-logo"
        onClick={() => user ? navigate(user.classGroup ? "/dashboard" : "/") : navigate("/login")}
      >
        <div className="logo-box">L</div>
        <span>LearnMate</span>
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            {/* Student context badges */}
            {user.classGroup && user.level && !isHome && (
              <div className="student-badge">
                <span className="badge-group">Class {user.classGroup}</span>
                <span className="badge-level" style={{ background: lc.bg, color: lc.color }}>
                  {user.level}
                </span>
              </div>
            )}

            {/* User menu */}
            <div className="user-menu">
              <button className="user-avatar" onClick={() => setDropOpen(o => !o)}>
                {user.name.charAt(0).toUpperCase()}
              </button>

              {dropOpen && (
                <div className="dropdown">
                  <p className="dropdown-name">{user.name}</p>
                  <p className="dropdown-email">{user.email}</p>
                  <hr className="dropdown-divider" />
                  {user.classGroup && user.level && (
                    <button className="dropdown-item" onClick={() => { navigate("/dashboard"); setDropOpen(false); }}>
                      Dashboard
                    </button>
                  )}
                  <button className="dropdown-item" onClick={() => { navigate("/"); setDropOpen(false); }}>
                    Change Level
                  </button>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item danger" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button className="nav-btn-ghost" onClick={() => navigate("/login")}>Login</button>
            <button className="nav-btn-solid" onClick={() => navigate("/register")}>Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
}
