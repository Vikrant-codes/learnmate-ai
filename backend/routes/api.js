const express = require("express");
const router = express.Router();
const { callGemini } = require("../gemini");
const { explainPrompt, doubtPrompt, notesPrompt, quizPrompt } = require("../prompts");

/* ── Input validation helper ── */
function validateBase(req, res) {
  const { subject, topic, classGroup, level } = req.body;
  if (!subject || !topic || !classGroup || !level) {
    res.status(400).json({ message: "Missing required fields: subject, topic, classGroup, level." });
    return false;
  }
  const validGroups  = ["5-8", "9-10", "11-12"];
  const validLevels  = ["Beginner", "Intermediate", "Advanced"];
  if (!validGroups.includes(classGroup)) {
    res.status(400).json({ message: "Invalid classGroup. Must be one of: 5-8, 9-10, 11-12." });
    return false;
  }
  if (!validLevels.includes(level)) {
    res.status(400).json({ message: "Invalid level. Must be one of: Beginner, Intermediate, Advanced." });
    return false;
  }
  return true;
}

/* ── POST /api/explain ── */
router.post("/explain", async (req, res) => {
  if (!validateBase(req, res)) return;
  try {
    const prompt = explainPrompt(req.body);
    const result = await callGemini(prompt);
    res.json({ result });
  } catch (err) {
    console.error("[/explain]", err.message);
    res.status(500).json({ message: err.message || "AI generation failed." });
  }
});

/* ── POST /api/doubt ── */
router.post("/doubt", async (req, res) => {
  if (!validateBase(req, res)) return;
  const { doubt } = req.body;
  if (!doubt || !doubt.trim()) {
    return res.status(400).json({ message: "Please provide your doubt." });
  }
  try {
    const prompt = doubtPrompt(req.body);
    const result = await callGemini(prompt);
    res.json({ result });
  } catch (err) {
    console.error("[/doubt]", err.message);
    res.status(500).json({ message: err.message || "AI generation failed." });
  }
});

/* ── POST /api/notes ── */
router.post("/notes", async (req, res) => {
  if (!validateBase(req, res)) return;
  try {
    const prompt = notesPrompt(req.body);
    const result = await callGemini(prompt);
    res.json({ result });
  } catch (err) {
    console.error("[/notes]", err.message);
    res.status(500).json({ message: err.message || "AI generation failed." });
  }
});

/* ── POST /api/quiz ── */
router.post("/quiz", async (req, res) => {
  if (!validateBase(req, res)) return;
  try {
    const prompt = quizPrompt(req.body);
    const result = await callGemini(prompt);
    res.json({ result });
  } catch (err) {
    console.error("[/quiz]", err.message);
    res.status(500).json({ message: err.message || "AI generation failed." });
  }
});

module.exports = router;
