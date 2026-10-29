
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ success: true, message: "Internship Portal API is running" });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Use an explicit absolute path to avoid route import ambiguity.
const applicationsRouter = require(
  path.join(__dirname, "routes", "applications.js")
);

app.use("/api/applications", applicationsRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

async function startServer() {
  try {
    if (!process.env.MONGO_DB_URI) {
      throw new Error(
        "MONGO_DB_URI is missing from the existing .env file. Check its variable name without changing the file."
      );
    }

    await mongoose.connect(process.env.MONGO_DB_URI);

    console.log("Database connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Backend startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
