import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const BASE = "https://learnmate-ai-almc.onrender.com/" || "http://localhost:5000/api";

function getToken() {
  const u = localStorage.getItem("lm_user");
  return u ? JSON.parse(u).token : null;
}

export async function apiRequest(method, endpoint, body = null, auth = true) {
  const headers = { "Content-Type": "application/json" };
  if (auth) headers["Authorization"] = `Bearer ${getToken()}`;
  const res = await fetch(`${BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("lm_user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  function login(userData) {
    setUser(userData);
    localStorage.setItem("lm_user", JSON.stringify(userData));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("lm_user");
  }

  function updateUser(data) {
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem("lm_user", JSON.stringify(updated));
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
