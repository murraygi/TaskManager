import React, { useState, useEffect, useRef } from "react";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Fab } from "@mui/material";
import { Zoom } from "@mui/material";

function TaskCreation(props) {
  const [isExpanded, setExpanded] = useState(false);

  // Task object
  const [task, setTask] = useState({
    title: "",
    content: "",
    priority: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  const formRef = useRef(null);

  // Handle changes for inputs and dropdown
  function handleChange(event) {
    const { name, value } = event.target; // Get the name and value of the changed field

    // Update the task object
    setTask((prevTask) => ({
      ...prevTask, // Keep other properties unchanged
      [name]: value, // Update the specific property
    }));

    // Clear validation error for the field
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  }

  // Handle task submission
  async function submitTask(event) {
    event.preventDefault();

    const errors = {};
    if (!task.title.trim()) {
      errors.title = "Title is required.";
    }
    if (!task.content.trim()) {
      errors.content = "Content is required.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return; // Stop execution if there are validation errors
    }

    const newTask = {
      title: task.title,
      content: task.content,
      priority: task.priority || "Low"
    };
      
    try {
      const response = await fetch("http://localhost:5050/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask)
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }
  
      const result = await response.json(); // Get saved task from DB
      props.onAdd(result); // Update UI with correct data from backend

    setTask({ // Reset form after submission
      title: "",
      content: "",
      priority: "",
    });

    setValidationErrors({});
    setExpanded(false); // Collapse after submitting
  } catch (error) {
    console.error("Error:", error);
  }
}

  // Expand the form on textarea click
  function expand() {
    setExpanded(true);
  }

  // Add a click listener to detect clicks outside of the form
  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setExpanded(false); // Collapse if clicked outside
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <form className="create-task" ref={formRef}>
        {isExpanded && (
          <>
            <input
              name="title"
              onChange={handleChange}
              value={task.title}
              placeholder="Title"
              maxLength="20"
              className={validationErrors.title ? "input-error" : ""}
            />
            {validationErrors.title && (
              <p className="error-message">{validationErrors.title}</p>
            )}
          </>
        )}

        {isExpanded && (
          <select
            name="priority"
            value={task.priority}
            onChange={handleChange}
          >
            <option value="">Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        )}

        <textarea
          name="content"
          onClick={expand}
          onChange={handleChange}
          value={task.content}
          placeholder="Write your task description."
          rows={isExpanded ? 3 : 1}
          maxLength="200"
          className={validationErrors.content ? "input-error" : ""}
        />
        {validationErrors.content && (
          <p className="error-message">{validationErrors.content}</p>
        )}

        <Zoom in={isExpanded}>
          <Fab onClick={submitTask}>
            <ArrowForwardIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default TaskCreation;