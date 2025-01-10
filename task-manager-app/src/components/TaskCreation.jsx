import React, { useState } from "react";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Fab } from "@mui/material";
import { Zoom } from "@mui/material";

function TaskCreation(props) {
  const [isExpanded, setExpanded] = useState(false);

  const [task, setTask] = useState({
    title: "",
    content: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setTask((prevTask) => {
      return {
        ...prevTask,
        [name]: value,
      };
    });
  }

  function submitTask(event) {
    props.onAdd(task);
    setTask({
      title: "",
      content: "",
    });
    event.preventDefault();
  }

  function expand() {
    setExpanded(true);
  }

  return (
    <div>
      <form className="create-task">
        {isExpanded && (
          <input
            name="title"
            onChange={handleChange}
            value={task.title}
            placeholder="Title"
          />
        )}

        <textarea
          name="content"
          onClick={expand}
          onChange={handleChange}
          value={task.content}
          placeholder="Create a task!"
          rows={isExpanded ? 3 : 1}
        />
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