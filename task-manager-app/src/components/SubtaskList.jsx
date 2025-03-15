import React, { useState } from "react";

function SubtaskList({ subtasks, onCreateSubtask, taskId }) {
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
    <div style={{ marginTop: "1rem", marginLeft: "1rem" }}>
      <button onClick={toggleSubtasks}>
        {showSubtasks ? "Hide" : "Subtasks"}
      </button>

      {/* If showing, display subtask list + creation form */}
      {showSubtasks && (
        <div className="subtask-section">
          <h4>Subtasks ({subtasks.length})</h4>

          {/* List of existing subtasks */}
          {subtasks.map((st) => (
            <div key={st.id} style={{ marginLeft: "1rem" }}>
              <input
                type="checkbox"
                checked={st.completed}
                disabled
                readOnly
              />
              <span style={{ marginLeft: "0.5rem" }}>
                {st.title} - {st.completed ? "Done" : "Pending"}
              </span>
            </div>
          ))}

          {/* Creation form */}
          <form onSubmit={submitSubtask} style={{ marginTop: "1rem" }}>
            <input
              type="text"
              name="title"
              placeholder="Subtask Title"
              value={subtask.title}
              onChange={handleChange}
              style={{ marginRight: "0.5rem" }}
            />
            <input
              type="text"
              name="content"
              placeholder="Subtask Content"
              value={subtask.content}
              onChange={handleChange}
              style={{ marginRight: "0.5rem" }}
            />
            <button type="submit">Add Subtask</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default SubtaskList;