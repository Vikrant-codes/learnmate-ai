const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function getToken() {
  const u = localStorage.getItem("lm_user");
  return u ? JSON.parse(u).token : null;
}

async function post(endpoint, body) {
  const res = await fetch(`${BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // All AI routes are now protected — send token automatically
      "Authorization": `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Something went wrong. Please try again.");
  }
  return res.json();
}

export const api = {
  explain: (body) => post("/explain", body),
  doubt:   (body) => post("/doubt",   body),
  notes:   (body) => post("/notes",   body),
  quiz:    (body) => post("/quiz",    body),
};
