import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth, apiRequest } from "../context/AuthContext";
import "./Auth.css";

/* ── LOGIN ── */
export function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const data = await apiRequest("POST", "/auth/login", { email, password }, false);
      login(data);
      // If they already have saved context go to dashboard, else home to select
      navigate(data.classGroup && data.level ? "/dashboard" : "/");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">L</div>
          <span>LearnMate</span>
        </div>
        <h1 className="auth-title">Welcome back!</h1>
        <p className="auth-sub">Sign in to continue your learning journey</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="field-label">Email</label>
            <input className="text-input" type="email" placeholder="you@example.com"
              value={email} onChange={e => { setEmail(e.target.value); setError(""); }} required />
          </div>
          <div className="auth-field">
            <label className="field-label">Password</label>
            <input className="text-input" type="password" placeholder="••••••••"
              value={password} onChange={e => { setPassword(e.target.value); setError(""); }} required />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <><span className="spinner" /> Signing in…</> : "Sign In"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register" className="auth-link">Sign up free</Link>
        </p>
      </div>
    </div>
  );
}

/* ── REGISTER ── */
export function Register() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setError(""); }

  async function handleSubmit(e) {
    e.preventDefault(); setError(""); 
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const data = await apiRequest("POST", "/auth/register", {
        name: form.name, email: form.email, password: form.password,
      }, false);
      login(data);
      navigate("/"); // go to home to select class + level
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">L</div>
          <span>LearnMate</span>
        </div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Join LearnMate and start learning smarter</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="field-label">Full Name</label>
            <input className="text-input" name="name" placeholder="Your name"
              value={form.name} onChange={handleChange} required />
          </div>
          <div className="auth-field">
            <label className="field-label">Email</label>
            <input className="text-input" name="email" type="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} required />
          </div>
          <div className="auth-field">
            <label className="field-label">Password</label>
            <input className="text-input" name="password" type="password" placeholder="Min 6 characters"
              value={form.password} onChange={handleChange} required />
          </div>
          <div className="auth-field">
            <label className="field-label">Confirm Password</label>
            <input className="text-input" name="confirm" type="password" placeholder="Repeat your password"
              value={form.confirm} onChange={handleChange} required />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <><span className="spinner" /> Creating account…</> : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
