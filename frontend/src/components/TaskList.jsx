import TaskItem from "./TaskItem";

// Renders every task as a TaskItem.
export default function TaskList({ tasks, onToggle, onDelete, onEdit }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}
