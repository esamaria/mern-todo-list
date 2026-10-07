import { useEffect, useState } from "react";
import { getTasks, addTask, updateTask, deleteTask } from "./api";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

// App owns the task list (state) and every function that calls the backend.
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Runs once when the page loads: GET all tasks from the backend
  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // POST a new task, then append it to state (no page reload)
  const handleAdd = async (title) => {
    try {
      const created = await addTask(title);
      setTasks((prev) => [...prev, created]);
      setError("");
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // PUT the flipped "completed" value, then replace that task in state
  const handleToggle = async (task) => {
    try {
      const updated = await updateTask(task._id, { completed: !task.completed });
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  // PUT a new title, then replace that task in state
  const handleEdit = async (id, title) => {
    try {
      const updated = await updateTask(id, { title });
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
      setError("");
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // DELETE on the server, then remove the task from state
  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const remaining = tasks.filter((t) => !t.completed).length;

  return (
    <div className="container">
      <h1>To-Do List</h1>

      <TaskForm onAdd={handleAdd} />

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Loading tasks...</p>}
      {!loading && tasks.length === 0 && (
        <p className="muted">No tasks yet. Add one above!</p>
      )}

      <TaskList
        tasks={tasks}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      {tasks.length > 0 && (
        <p className="muted">
          {remaining} of {tasks.length} task{tasks.length === 1 ? "" : "s"} remaining
        </p>
      )}
    </div>
  );
}
