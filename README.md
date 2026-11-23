# TaskNest — a beginner MERN app

TaskNest is a tiny task manager designed to demonstrate the MERN stack:

- **React** renders the user interface.
- **Express** exposes a small REST API.
- **MongoDB** stores tasks through Mongoose.

## 1. Install

From this folder, run:

```bash
npm run install:all
```

## 2. Connect MongoDB

Copy `server/.env.example` to `server/.env` and set `MONGODB_URI`.

For local MongoDB, the default value is already suitable:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/tasknest
```

You can also use a MongoDB Atlas connection string.

## 3. Start the app

```bash
npm run dev
```

Open `http://localhost:5173`. The API runs on `http://localhost:5000`.

If MongoDB is not available, the app starts with temporary in-memory sample tasks so you can still explore the UI. Start MongoDB to save tasks permanently.

## API routes

| Method | Route | What it does |
| --- | --- | --- |
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id/toggle` | Mark a task done or undone |
| DELETE | `/api/tasks/:id` | Delete a task |
