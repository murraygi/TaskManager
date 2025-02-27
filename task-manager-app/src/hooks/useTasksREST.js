import { useState, useEffect } from "react";

export function useTasksREST() {
    const [tasks, setTasks] = useState([]);

    // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // 1) FETCH ALL TASKS
  function fetchTasks() {
    fetch("http://localhost:5050/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks (REST):", error));
  }

  // 2) ADD TASK
  async function addTask(newTask) {
    try {
      const response = await fetch("http://localhost:5050/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) throw new Error("Failed to create task");
      const createdTask = await response.json();
      setTasks((prev) => [...prev, createdTask]);
    } catch (error) {
      console.error(error);
    }
  }

  // 3) SAVE/UPDATE TASK
  async function saveTask(id, updatedTask) {
    try {
      const response = await fetch(`http://localhost:5050/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
      if (!response.ok) throw new Error("Failed to update task");
      const updatedData = await response.json();
      // Update local state
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedData.id ? updatedData : t))
      );
    } catch (error) {
      console.error(error);
    }
  }

  // 4) DELETE TASK
  async function deleteTask(id) {
    try {
      const response = await fetch(`http://localhost:5050/api/tasks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete task");
      // Filter out from local state
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error(error);
    }
  }

  // 5) TOGGLE COMPLETE
  async function toggleComplete(id) {
    const targetTask = tasks.find((t) => t.id === id);
    if (!targetTask) return;
    const newCompleted = !targetTask.completed;

    try {
      const response = await fetch(`http://localhost:5050/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: newCompleted }),
      });
      if (!response.ok) throw new Error("Failed to toggle completion");
      const updatedData = await response.json();
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updatedData : t))
      );
    } catch (error) {
      console.error(error);
    }
  }

    // Return the tasks state + all the methods
    return { tasks, fetchTasks, addTask, toggleComplete, deleteTask, saveTask };
}