import React, { useState, useEffect, useRef } from "react";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Fab, Zoom } from "@mui/material";

function TaskCreation(props) {
  const [isExpanded, setExpanded] = useState(false);
  const [task, setTask] = useState({ title: "", content: "", priority: "" });
  const [validationErrors, setValidationErrors] = useState({});
  const formRef = useRef(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setTask((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  }

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
      return;
    }

    // Instead of fetching here, just pass it upward:
    props.onAdd({
      title: task.title,
      content: task.content,
      priority: task.priority || "Low"
    });

    // Reset after passing the new task
    setTask({ title: "", content: "", priority: "" });
    setValidationErrors({});
    setExpanded(false);
  }

  function expand() {
    setExpanded(true);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

            <select name="priority" value={task.priority} onChange={handleChange}>
              <option value="">Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </>
        )}

        <textarea
          name="content"
          id="task-content"
          onClick={expand}
          onChange={handleChange}
          value={task.content}
          placeholder="Write your task description."
          rows={isExpanded ? 3 : 1}
          maxLength="20000"
          className={validationErrors.content ? "input-error" : ""}
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            resize: "vertical"
          }}
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