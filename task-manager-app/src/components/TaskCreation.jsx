import React, { useState, useEffect, useRef } from "react";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Fab, Zoom } from "@mui/material";

function TaskCreation(props) {
  const [isExpanded, setExpanded] = useState(false);
  const [task, setTask] = useState({ title: "", content: "", priority: "" });

  // Track subtasks here
  const [subtasks, setSubtasks] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const formRef = useRef(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setTask((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleSubtaskChange(idx, event) {
    const { name, value } = event.target;
    setSubtasks((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [name]: value };
      return updated;
    });
  }

  function addSubtaskRow() {
    setSubtasks((prev) => [...prev, { title: "", content: "", completed: false }]);
  }

  function removeSubtaskRow(idx) {
    setSubtasks((prev) => prev.filter((_, i) => i !== idx));
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

    props.onAdd({
      title: task.title,
      content: task.content,
      priority: task.priority || "Low",
      // Only used by GraphQL path. If REST is selected, it just ignores it.
      subtasks: subtasks
    });

    setTask({ title: "", content: "", priority: "" });
    setSubtasks([]);
    setValidationErrors({});
    setExpanded(false);
  }

  function expand() {
    setExpanded(true);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (formRef.current && !formRef.current.contains(e.target)) {
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
          style={{ maxHeight: "200px", overflowY: "auto", resize: "vertical" }}
        />
        {validationErrors.content && (
          <p className="error-message">{validationErrors.content}</p>
        )}

        {isExpanded && (
          <div className="subtask-creation-area">
            <h4>Subtasks</h4>
            {subtasks.map((st, idx) => (
              <div key={idx} className="subtask-row">
                <input
                  type="text"
                  name="title"
                  placeholder="Subtask Title"
                  value={st.title}
                  onChange={(e) => handleSubtaskChange(idx, e)}
                />
                <input
                  type="text"
                  name="content"
                  placeholder="Subtask Content"
                  value={st.content}
                  onChange={(e) => handleSubtaskChange(idx, e)}
                />
                <button type="button" onClick={() => removeSubtaskRow(idx)}>Remove</button>
              </div>
            ))}
            <button className="subTaskBTN" type="button" onClick={addSubtaskRow}>
              + Add
            </button>
          </div>
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