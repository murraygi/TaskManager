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
    const newId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 0; // Increment last task's id
    setTasks((prevTasks) => [...prevTasks, { ...newTask, id: newId, completed: false }]);
  }  

  function toggleComplete(id) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function deleteTask(id) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
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
      {tasks
        .slice() // Create a copy of tasks to avoid mutating the original array
        .sort((a, b) => a.completed - b.completed) // Sort: incomplete first
        .map((taskItem) => (
          editingTaskId === taskItem.id ? (
            <TaskEditMode
              key={taskItem.id}
              id={taskItem.id}
              title={taskItem.title}
              content={taskItem.content}
              priority={taskItem.priority}
              onSave={saveTask}
            />
          ) : (
            <Task
              key={taskItem.id}
              id={taskItem.id}
              title={taskItem.title}
              content={taskItem.content}
              priority={taskItem.priority}
              completed={taskItem.completed}
              onToggleComplete={toggleComplete}
              onDelete={deleteTask}
              onEdit={() => editTask(taskItem.id)}
            />
          )
        ))}
      <Footer />
    </div>
  );
}

export default App;