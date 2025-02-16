import React, { useState, useEffect } from "react";

function TaskEditMode(props) {
  const [task, setTask] = useState({
    title: props.task?.title || "",
    content: props.task?.content || "",
    priority: props.task?.priority || "",
  });

  // Update the state when props change
  useEffect(() => {
    if (props.task) {
      setTask({
        title: props.task.title || "",
        content: props.task.content || "",
        priority: props.task.priority || "",
      });
    }
  }, [props.task]); // Re-run when any of the props change

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

  // Handle canceling the edit
  function cancelEdit() {
    props.onCancel(); // Reset editing mode in the parent component
  }

  return (
    <div className="task-edit">
      <form>
        <input
          name="title"
          onChange={handleChange}
          value={task.title}
          placeholder="Title"
          maxLength="15"
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
        <div className="task-actions">
          <button className="saveBtn" onClick={saveTask}>Save</button>
          <button className="cancelBtn" onClick={cancelEdit}>Cancel</button>
        </div>        
      </form>
    </div>
  );
}

export default TaskEditMode;