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
  function submitTask(event) {
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

    props.onAdd(task); // Pass the task (with priority) to the parent
    
    setTask({ // Reset priorities after submission
      title: "",
      content: "",
      priority: "",
    });
    setValidationErrors({});
    setExpanded(false); // Collapse after submitting
    event.preventDefault();
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