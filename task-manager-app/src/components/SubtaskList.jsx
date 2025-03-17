import React, { useState } from "react";
import AddIcon from '@mui/icons-material/Add';

function SubtaskList({ subtasks, onCreateSubtask, taskId, onToggleSubtaskComplete }) {
  const [showSubtasks, setShowSubtasks] = useState(false);

  // Local state for subtask creation:
  const [subtask, setSubtask] = useState({ title: "", content: "" });

  // Toggle subtasks
  function toggleSubtasks() {
    setShowSubtasks((prev) => !prev);
  }

  // Handle input changes for new subtask
  function handleChange(e) {
    const { name, value } = e.target;
    setSubtask((prev) => ({ ...prev, [name]: value }));
  }

  // Submit new subtask
  function submitSubtask(e) {
    e.preventDefault();
    if (!subtask.title.trim() || !subtask.content.trim()) return;
    onCreateSubtask(taskId, {
      title: subtask.title,
      content: subtask.content,
      completed: false
    });
    // Reset form
    setSubtask({ title: "", content: "" });
  }

  return (
    <div className="subtask-header">
      <button onClick={toggleSubtasks} className="toggleBtn">
        {showSubtasks ? "Hide Subtasks" : "+ Create Subtask"}
      </button>

      {/* If showing, display subtask list + creation form */}
      {showSubtasks && (
        <div className="subtask-section">
          <h4>Subtasks ({subtasks.length})</h4>

            {/* List of existing subtasks */}
            {subtasks.map((st) => (
            <div
              key={st.id}
              className="subtask-item">
              <input
                type="checkbox"
                checked={st.completed}
                onChange={() => onToggleSubtaskComplete(taskId, st.id, st.completed)}
              />
              <span
                style={{textDecoration: st.completed ? "line-through" : "none"}}>
                <strong>{st.title}</strong> - {st.content} -{" "}
                {st.completed ? "Done" : "Pending"}
              </span>
            </div>
          ))}

          {/* Creation form */}
          <form onSubmit={submitSubtask} className="subtask-form">
            <input
              type="text"
              name="title"
              placeholder="Subtask Title"
              value={subtask.title}
              onChange={handleChange}
            />
            <input
              type="text"
              name="content"
              placeholder="Subtask Content"
              value={subtask.content}
              onChange={handleChange}
            />
            <button className="addBtn" type="submit">
              <AddIcon />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default SubtaskList;