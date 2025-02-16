import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import TaskCreation from "./TaskCreation";
import TaskList from "./TaskList";
import TaskEditMode from "./TaskEditMode";

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    async function fetchTasks() {
      const response = await fetch("http://localhost:5050/api/tasks");
      const data = await response.json();
      setTasks(data);
    }
    fetchTasks();
  }, []);
  
  async function addTask(newTask) {
    // Post the new task to backend
    try {
      const response = await fetch("http://localhost:5050/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask)
      });

      if (!response.ok) {
        console.error("Failed to create task", response.status);
        return;
      }
      const createdTask = await response.json();
      // Update local state with the created task from backend
      setTasks(prevTasks => [...prevTasks, createdTask]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }  

  // Toggle task completion
  function toggleComplete(id) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  // Delete task from frontend and backend
  async function deleteTask(id) {
    console.log("Attempting to delete task with ID:", id);  // Debugging line
    try {
      const response = await fetch(`http://localhost:5050/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
        if (editingTaskId === id) {
          setEditingTaskId(null);
        }
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  // Edit task
  function editTask(id) {
    setEditingTaskId(id);
  }

  // Save edited task
  async function saveTask(id, updatedTask) {
    console.log("Saving task with ID:", id);  // Debugging line
    try {
      const response = await fetch(`http://localhost:5050/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });
  
      if (response.ok) {
        const updatedData = await response.json();
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updatedData.id ? { ...updatedData } : task
          )
        );
        setEditingTaskId(null);
      } else {
        console.error("Failed to save task");
      }
    } catch (error) {
      console.error("Error saving task:", error);
    }
  }
  
  return (
    <div className="testMain">
      <Header />
      <TaskCreation onAdd={addTask} />
      {editingTaskId ? (
        <TaskEditMode
          id={editingTaskId}
          task={tasks.find((task) => task.id === editingTaskId)}
          onSave={saveTask}
          onCancel={() => setEditingTaskId(null)}
        />
      ) : (
        <TaskList
          tasks={tasks}
          onToggleComplete={toggleComplete}
          onDelete={deleteTask}
          onEdit={editTask}
        />
      )}
      <Footer />
    </div>
  );
}

export default App;