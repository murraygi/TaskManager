// hooks/useTasksGraphQL.js
import { useState, useEffect } from "react";

export function useTasksGraphQL() {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 10;  // Adjust as needed
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch first page on mount
  useEffect(() => {
    fetchTasks(page);
  }, []);

  // Fetch tasks by page
  async function fetchTasks(pageNum) {
    if (loading || !hasMore) return; 
    setLoading(true);

    try {
      //POST graphql with page and limit
    const response = await fetch("http://localhost:5050/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
            query ($page: Int, $limit: Int) {
              tasks(page: $page, limit: $limit) {
                rows {
                  id
                  title
                  content
                  priority
                  completed
                }
                total
              }
            }
          `,
          variables: { page: pageNum, limit },
        }),
      });
      if (!response.ok) throw new Error("GraphQL request failed");
      const result = await response.json();
      // tasks(page, limit) => returns { rows, total }
      const { rows, total } = result.data.tasks;
      // append new tasks to existing list
      setTasks((prev) => [...prev, ...rows]);
      if (rows.length < limit) {
        setHasMore(false);
      }
      // increment page for next call
      setPage(pageNum + 1);

    } catch (error) {
      console.error("Error fetching tasks (GraphQL):", error);
    } finally {
      setLoading(false);
    }
  }

  // Load more when user scrolls down
  function loadMore() {
    fetchTasks(page);
  }

  // 2) ADD TASK (GraphQL mutation)
  async function addTask(newTask) {
    try {
      const response = await fetch("http://localhost:5050/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation($title: String!, $content: String!, $priority: String, $completed: Boolean) {
              createTask(title: $title, content: $content, priority: $priority, completed: $completed) {
                id
                title
                content
                priority
                completed
              }
            }
          `,
          variables: newTask,
        }),
      });
      if (!response.ok) throw new Error("Failed to create task");
      const result = await response.json();
      const createdTask = result.data.createTask;
      setTasks((prev) => [...prev, createdTask]);
    } catch (error) {
      console.error(error);
    }
  }

  // 3) SAVE/UPDATE TASK
  async function saveTask(id, updatedTask) {
    try {
      const response = await fetch("http://localhost:5050/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation($id: Int!, $title: String, $content: String, $priority: String, $completed: Boolean) {
              updateTask(id: $id, title: $title, content: $content, priority: $priority, completed: $completed) {
                id
                title
                content
                priority
                completed
              }
            }
          `,
          variables: { id, ...updatedTask },
        }),
      });
      if (!response.ok) throw new Error("Failed to update task");
      const result = await response.json();
      const updatedData = result.data.updateTask;
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
      const response = await fetch("http://localhost:5050/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation($id: Int!) {
              deleteTask(id: $id)
            }
          `,
          variables: { id },
        }),
      });
      if (!response.ok) throw new Error("Failed to delete task");
      // On success, remove from local state
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
      const response = await fetch("http://localhost:5050/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation($id: Int!, $completed: Boolean) {
              updateTask(id: $id, completed: $completed) {
                id
                completed
              }
            }
          `,
          variables: { id, completed: newCompleted },
        }),
      });
      if (!response.ok) throw new Error("Failed to toggle completion");
      const result = await response.json();
      const updatedData = result.data.updateTask;
      setTasks((prev) => prev.map((t) => (t.id === updatedData.id ? updatedData : t)));
    } catch (error) {
      console.error(error);
    }
  }

  return { tasks, loadMore, hasMore, loading, addTask, saveTask, deleteTask, toggleComplete };
}