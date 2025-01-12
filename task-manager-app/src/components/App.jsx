import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Task from "./Task";
import TaskCreation from "./TaskCreation";
import TaskEditMode from "./TaskEditMode";

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);

  function addTask(newTask) {
    setTasks(prevTasks => {
      return [...prevTasks, newTask];
    });
  }

  function deleteTask(id) {
    setTasks((prevTasks) => prevTasks.filter((_, index) => index !== id));
    if (editingTaskId === id) {
      setEditingTaskId(null); // Exit edit mode if the edited task is deleted
    }
  }

  function editTask(id) {
    console.log("Editing task with ID:", id);
    setEditingTaskId(id); // Enable editing mode for the task with this ID
  }

  function saveTask(id, updatedTask) {
    setTasks((prevTasks) =>
      prevTasks.map((task, index) => (index === id ? updatedTask : task))
    );
    setEditingTaskId(null); // Exit edit mode
  }

  return (
    <div>
      <Header />
      <TaskCreation onAdd={addTask} />
      {tasks.map((taskItem, index) => {
        return editingTaskId === index ? (
          <TaskEditMode
            key={index}
            id={index}
            title={taskItem.title}
            content={taskItem.content}
            priority={taskItem.priority}
            onSave={saveTask}
          />
        ) : (
          <Task
            key={index}
            id={index}
            title={taskItem.title}
            content={taskItem.content}
            priority={taskItem.priority}
            onDelete={deleteTask}
            onEdit={() => editTask(index)}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;