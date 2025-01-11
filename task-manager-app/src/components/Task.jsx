import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";

function Task(props) {
  function handleClick() {
    props.onDelete(props.id);
  }

  return (
    <div className="task">
      <h1>{props.title}</h1>
      <p className="taskPriority">Priority: {props.priority || "Not set"}</p>
      <p className="taskContent">{props.content}</p>
      <button onClick={handleClick}>
        <DeleteIcon />
      </button>
    </div>
  );
}

export default Task;