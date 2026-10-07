import { useState } from "react";

// One row in the list: checkbox, title (editable) and delete button.
export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

  // Save the edited title through the parent (which calls PUT)
  const save = async () => {
    if (!draft.trim()) return;
    const ok = await onEdit(task._id, draft.trim());
    if (ok) setEditing(false);
  };

  return (
    <li className={task.completed ? "done" : ""}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
      />

      {editing ? (
        <>
          <input
            className="edit-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            autoFocus
          />
          <button onClick={save}>Save</button>
          <button className="secondary" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <span className="title" onDoubleClick={() => setEditing(true)}>
            {task.title}
          </span>
          <button className="secondary" onClick={() => setEditing(true)}>
            Edit
          </button>
          <button className="danger" onClick={() => onDelete(task._id)}>
            Delete
          </button>
        </>
      )}
    </li>
  );
}
