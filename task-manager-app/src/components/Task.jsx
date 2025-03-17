import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SubtaskList from "./SubtaskList";

function Task(props) {
  return (
    <div className={`task ${props.completed ? "completed" : ""}`}>
      <div className="task-header">
        <input
          type="checkbox"
          checked={props.completed}
          onChange={() => props.onToggleComplete(props.id)}
        />
        <h2>{props.title}</h2>
      </div>
      <p className="taskContent">{props.content}</p>
      <div className="task-footer">
        <p className="taskPriority">Priority: {props.priority || "Not set"}</p>
          <button onClick={props.onEdit}>
            <EditIcon />
          </button>
          <button onClick={() => props.onDelete(props.id)}>
            <DeleteIcon />
          </button>
        </div>
      <SubtaskList
        subtasks={props.subtasks || []}
        taskId={props.id}
        onCreateSubtask={props.onCreateSubtask}
        onToggleSubtaskComplete={props.toggleSubtaskComplete}
       />
   </div>
  );
}

export default Task;