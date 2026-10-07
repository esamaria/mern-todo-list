import { useState } from "react";

// Form to add a new task. The input text is local state; the parent does the API call.
export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the browser from reloading the page
    if (!title.trim()) return;
    const added = await onAdd(title.trim());
    if (added) setTitle(""); // clear the input only if the task was saved
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add a new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}
