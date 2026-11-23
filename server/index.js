import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { Task } from "./models/Task.js";

const app = express();
const port = process.env.PORT || 5000;
let databaseReady = false;
let memoryTasks = [
  { _id: "welcome-1", title: "Set up the MERN project", completed: true },
  { _id: "welcome-2", title: "Build the task API", completed: false },
  { _id: "welcome-3", title: "Connect MongoDB", completed: false },
  { _id: "welcome-4", title: "Create the React UI", completed: false }
];

app.use(cors());
app.use(express.json());

const getTasks = async () => databaseReady ? Task.find().sort({ createdAt: -1 }) : memoryTasks;

app.get("/api/tasks", async (_req, res) => res.json(await getTasks()));

app.post("/api/tasks", async (req, res) => {
  const title = req.body.title?.trim();
  if (!title) return res.status(400).json({ message: "A task title is required." });

  if (databaseReady) return res.status(201).json(await Task.create({ title }));

  const task = { _id: `memory-${Date.now()}`, title, completed: false };
  memoryTasks = [task, ...memoryTasks];
  return res.status(201).json(task);
});

app.patch("/api/tasks/:id/toggle", async (req, res) => {
  if (databaseReady) {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found." });
    task.completed = !task.completed;
    return res.json(await task.save());
  }
  memoryTasks = memoryTasks.map((task) => task._id === req.params.id ? { ...task, completed: !task.completed } : task);
  return res.json(memoryTasks.find((task) => task._id === req.params.id));
});

app.delete("/api/tasks/:id", async (req, res) => {
  if (databaseReady) await Task.findByIdAndDelete(req.params.id);
  else memoryTasks = memoryTasks.filter((task) => task._id !== req.params.id);
  res.status(204).send();
});

app.get("/api/health", (_req, res) => res.json({ status: "ok", database: databaseReady ? "connected" : "demo mode" }));

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/tasknest", { serverSelectionTimeoutMS: 3000 });
    databaseReady = true;
    console.log("MongoDB connected");
  } catch {
    console.log("MongoDB not connected — using demo data until it is available.");
  }
  app.listen(port, () => console.log(`API ready at http://localhost:${port}`));
}

start();
