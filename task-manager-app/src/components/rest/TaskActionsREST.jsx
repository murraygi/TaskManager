import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function TaskAction({ onEdit, onDelete, id }) {
  return (
    <div className="task-footer">
      <button onClick={onEdit}>
        <EditIcon />
      </button>
      <button onClick={() => onDelete(id)}>
        <DeleteIcon />
      </button>
    </div>
  );
}

export default TaskAction;