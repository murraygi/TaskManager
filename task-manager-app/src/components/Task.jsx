import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function Task(props) {
  return (
    <div className="task">
      <h1>{props.title}</h1>
      <p className="taskPriority">Priority: {props.priority || "Not set"}</p>
      <p className="taskContent">{props.content}</p>
      <div className="task-buttons">
      <button onClick={props.onEdit}>
        <EditIcon />
      </button>
      <button onClick={() => props.onDelete(props.id)}>
        <DeleteIcon />
      </button>
      </div>
    </div>
  );
}

export default Task;