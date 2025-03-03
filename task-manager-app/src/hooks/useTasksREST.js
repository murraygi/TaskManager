import { useState, useEffect } from "react";

export function useTasksREST() {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 10; // Number of tasks per page
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch first page on mount
  useEffect(() => {
    fetchTasks(1); // Start on page 1
  }, []);

  // Fetch tasks by page
  async function fetchTasks(pageNum) {
    if (loading || !hasMore) return; // Prevent duplicate calls
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5050/api/tasks?page=${pageNum}&limit=${limit}`);
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json(); // e.g. { tasks: [...], total: 100 }

      setTasks((prev) => [...prev, ...data.tasks]); // Append new tasks to existing list

      // If fewer tasks returned than limit, no more data left
      if (data.tasks.length < limit) {
        setHasMore(false);
      }

      setPage(pageNum + 1); // Increment page so next loadMore call fetches the next page
    } catch (error) {
      console.error("Error fetching tasks (REST):", error);
    } finally {
      setLoading(false);
    }
  }

  // loadMore is triggered when the user scrolls to the bottom
  function loadMore() {
    fetchTasks(page);
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
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedData : t)));
    } catch (error) {
      console.error(error);
    }
  }

  return {
    tasks,
    loadMore,
    hasMore,
    loading,
    addTask,
    toggleComplete,
    deleteTask,
    saveTask,
  };
}