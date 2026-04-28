require("dotenv").config();
const express   = require("express");
const cors      = require("cors");
const mongoose  = require("mongoose");
const apiRoutes  = require("./routes/api");
const authRoutes = require("./routes/auth");
const { protect } = require("./middleware/auth");

const app  = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "" || "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "10kb" }));

// Public auth routes
app.use("/api/auth", authRoutes);

// Protected AI routes — must be logged in
app.use("/api", protect, apiRoutes);

// Health check
app.get("/health", (_, res) => res.json({ status: "ok", service: "LearnMate API" }));

// 404
app.use((_, res) => res.status(404).json({ message: "Route not found." }));

// Error handler
app.use((err, _, res, __) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error." });
});

// Connect DB then start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`✅ LearnMate backend running on http://localhost:${PORT}`);
      console.log(`   Gemini API key: ${process.env.GEMINI_API_KEY ? "✓ Set" : "✗ NOT SET"}`);
    });
  })
  .catch(err => { console.error("MongoDB error:", err.message); process.exit(1); });
