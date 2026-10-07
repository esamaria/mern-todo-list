// All calls to the backend REST API live in this file.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const BASE = `${API_URL}/api/tasks`;

// Shared helper: sends the request, parses JSON, throws an Error on 4xx/5xx
async function request(url, options) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// GET /api/tasks
export const getTasks = () => request(BASE);

// POST /api/tasks
export const addTask = (title) =>
  request(BASE, { method: "POST", body: JSON.stringify({ title }) });

// PUT /api/tasks/:id  (updates = { completed } and/or { title })
export const updateTask = (id, updates) =>
  request(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify(updates) });

// DELETE /api/tasks/:id
export const deleteTask = (id) => request(`${BASE}/${id}`, { method: "DELETE" });
