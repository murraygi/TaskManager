import React, { useState } from "react";

function TaskEditMode(props) {
  const [task, setTask] = useState({
    title: props.title,
    content: props.content,
    priority: props.priority,
  });

  // Handle changes to inputs
  function handleChange(event) {
    const { name, value } = event.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  }

  // Handle saving the edited task
  function saveTask(event) {
    event.preventDefault();
    props.onSave(props.id, task); // Pass the updated task back to the parent
  }

  return (
    <div className="task-edit">
      <form>
        <input
          name="title"
          onChange={handleChange}
          value={task.title}
          placeholder="Title"
          maxLength="20"
        />
        <select name="priority" value={task.priority} onChange={handleChange}>
          <option value="">Select Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <textarea
          name="content"
          onChange={handleChange}
          value={task.content}
          placeholder="Task Description"
          rows="3"
          maxLength="200"
        />
        <button onClick={saveTask}>Save</button>
      </form>
    </div>
  );
}

export default TaskEditMode;