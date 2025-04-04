import React, { useState, useEffect } from "react";

function TaskEditMode(props) {
  // local state for the editable task fields
  const [task, setTask] = useState({
    title: props.task?.title || "",
    content: props.task?.content || "",
    priority: props.task?.priority || "",
  });

  // if props.task changes (e.g. selects a new task to edit), update the local state
  useEffect(() => {
    if (props.task) {
      setTask({
        title: props.task.title || "",
        content: props.task.content || "",
        priority: props.task.priority || "",
      });
    }
  }, [props.task]);

  // Handle changes to inputs/select/textarea
  function handleChange(event) {
    const { name, value } = event.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  }

  // When the form is submitted, send updated task back to the parent
  function saveTask(event) {
    event.preventDefault();
    props.onSave(props.id, task); // Parent handles the actual save logic 
  }

  // Cancel button exits edit mode via the parent callback
  function cancelEdit() {
    props.onCancel();
  }

  return (
    <div className="task-edit">
      <form>
        <input
          name="title"
          id="edit-task-title"
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
          id="edit-task-content"
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