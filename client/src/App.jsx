import { useEffect, useState } from "react";
import { taskApi } from "./api";

function Task({ task, onComplete, onDelete }) {
  return <li className={task.completed ? "task completed" : "task"}>
    <span>{task.title}</span>
    <div className="task-actions">
      <button className="complete" onClick={() => onComplete(task._id)}>{task.completed ? "Completed" : "Complete"}</button>
      <button className="delete" onClick={() => onDelete(task._id)}>Delete</button>
    </div>
  </li>;
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { taskApi.list().then(setTasks).catch(() => setError("Could not connect to the task server.")); }, []);
  async function addTask(event) { event.preventDefault(); if (!title.trim()) return; try { const task = await taskApi.create(title); setTasks((items) => [task, ...items]); setTitle(""); } catch (requestError) { setError(requestError.message); } }
  async function completeTask(id) { try { const task = await taskApi.toggle(id); setTasks((items) => items.map((item) => item._id === id ? task : item)); } catch (requestError) { setError(requestError.message); } }
  async function deleteTask(id) { try { await taskApi.remove(id); setTasks((items) => items.filter((item) => item._id !== id)); } catch (requestError) { setError(requestError.message); } }

  return <div className="page"><header><a href="#top">StudyBoard</a><span>Devashish Bogati</span></header><main id="top"><section className="intro"><h1>My study week</h1><p>Wednesday, 19 November</p></section><section className="deadline"><b>Upcoming deadline</b><span><strong>WEB 301</strong> · Portfolio website due Friday, 21 November</span></section><section className="tasks" id="tasks"><h2>Tasks</h2><form onSubmit={addTask}><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Add a task (e.g. Read WEB 301 notes)" maxLength="120" /><button type="submit">Add task</button></form>{error && <p className="error">{error}</p>}<ul>{tasks.length ? tasks.map((task) => <Task key={task._id} task={task} onComplete={completeTask} onDelete={deleteTask} />) : <li className="empty">No tasks yet.</li>}</ul></section></main><footer>StudyBoard · Devashish Bogati · 2026</footer></div>;
}
