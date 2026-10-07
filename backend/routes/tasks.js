const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");

const router = express.Router();

// Convert any value to a trimmed string (undefined/null become "")
const cleanTitle = (value) => String(value ?? "").trim();

// Reject malformed ids early instead of letting Mongoose throw a CastError
const validateId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid task id" });
  }
  next();
};

// GET /api/tasks - fetch all tasks (oldest first)
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/tasks - add a new task; 201 on success, 400 if title is empty
router.post("/", async (req, res) => {
  try {
    const title = cleanTitle(req.body.title);
    if (!title) return res.status(400).json({ message: "Title cannot be empty" });

    const task = await Task.create({ title });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/tasks/:id - edit the title and/or mark complete/incomplete
router.put("/:id", validateId, async (req, res) => {
  try {
    const updates = {};

    if (req.body.title !== undefined) {
      const title = cleanTitle(req.body.title);
      if (!title) return res.status(400).json({ message: "Title cannot be empty" });
      updates.title = title;
    }
    if (req.body.completed !== undefined) {
      updates.completed = Boolean(req.body.completed);
    }

    const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/tasks/:id - remove a task; 404 if it does not exist
router.delete("/:id", validateId, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted", id: task._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
