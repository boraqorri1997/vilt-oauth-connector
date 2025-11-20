require('dotenv').config();

// index.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { issueToken } = require("./controllers/authController");
const admin = require("./controllers/adminController");
const protectedController = require("./controllers/protectedController");

const app = express();

app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Health
app.get("/health", (_req, res) => res.json({ ok: true }));

// OAuth Mock
app.post("/oauth/token", issueToken);

// Admin / Monitoring
app.post("/admin/reset", admin.reset);
app.get("/admin/metrics", admin.metrics);
app.post("/admin/config", admin.config);
app.get("/admin/tokens", admin.tokens);

// Functional (require Bearer token) — all POST with JSON bodies
app.post("/api/createsession", protectedController.createSession);
app.post("/api/updatesession", protectedController.updateSession);
app.post("/api/cancelsession", protectedController.cancelSession);

// New instructor endpoint
app.post("/api/addinstructor", protectedController.addInstructor);
app.post('/api/updateinstructor', protectedController.updateInstructor);

// Dev server only (Vercel imports the app instead)
if (process.env.VERCEL !== "1") {
  const port = process.env.PORT || 8000;
  app.listen(port, () => console.log(`Mock OAuth server running on ${port}`));
}

module.exports = app;
