import React from "react";
import Task from "./Task";

function TaskList({ tasks, onToggleComplete, onDelete, onEdit }) {
  return (
    <div>
      {tasks
        .slice() // Create a copy of tasks to avoid mutating the original array
        .sort((a, b) => a.completed - b.completed) // Sort: incomplete first
        .map((taskItem) => (
          <Task
            key={taskItem.id}
            id={taskItem.id}
            title={taskItem.title}
            content={taskItem.content}
            priority={taskItem.priority}
            completed={taskItem.completed}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            onEdit={() => onEdit(taskItem.id)}
          />
        ))}
    </div>
  );
}

export default TaskList;