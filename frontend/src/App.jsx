import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Explain from "./pages/Explain";
import Notes from "./pages/Notes";
import Quiz from "./pages/Quiz";
import { Login, Register } from "./pages/Auth";
import "./styles/globals.css";

/* ── Route Guards ── */

// Must be logged in
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

// Must NOT be logged in (redirect logged-in users away from login/register)
function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/" replace />;
}

// Must be logged in AND have selected class + level
function StudentRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.classGroup || !user.level) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Home — context selection (must be logged in) */}
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />

        {/* Dashboard and modules — need class+level set */}
        <Route path="/dashboard" element={<StudentRoute><Dashboard /></StudentRoute>} />
        <Route path="/explain"   element={<StudentRoute><Explain /></StudentRoute>} />
        <Route path="/notes"     element={<StudentRoute><Notes /></StudentRoute>} />
        <Route path="/quiz"      element={<StudentRoute><Quiz /></StudentRoute>} />

        {/* Auth pages — only for guests */}
        <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
