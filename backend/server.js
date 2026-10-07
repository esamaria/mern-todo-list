require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const taskRoutes = require("./routes/tasks");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Allow requests only from the React frontend, not from every origin
app.use(cors({ origin: FRONTEND_URL }));
// Parse JSON request bodies into req.body
app.use(express.json());

app.use("/api/tasks", taskRoutes);

if (!MONGO_URI) {
  console.error("MONGO_URI is missing. Copy .env.example to .env and set it.");
  process.exit(1);
}

// Connect to MongoDB first, then start listening for requests
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
