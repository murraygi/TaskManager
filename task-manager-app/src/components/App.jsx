import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Task from "./Task";
import TaskCreation from "./TaskCreation";

function App() {
  const [tasks, setTasks] = useState([]);

  function addTask(newTask) {
    setTasks(prevTasks => {
      return [...prevTasks, newTask];
    });
  }

  function deleteTask(id) {
    setTasks(prevTasks => {
      return prevTasks.filter((taskItem, index) => {
        return index !== id;
      });
    });
  }

  return (
    <div>
      <Header />
      <TaskCreation onAdd={addTask} />
      {tasks.map((taskItem, index) => {
        return (
          <Task
            key={index}
            id={index}
            title={taskItem.title}
            content={taskItem.content}
            onDelete={deleteTask}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;