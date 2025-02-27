// hooks/useTasksGraphQL.js
import { useState, useEffect } from "react";

export function useTasksGraphQL() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  // 1) FETCH ALL TASKS (GraphQL query)
  function fetchTasks() {
    fetch("http://localhost:5050/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query {
            tasks {
              id
              title
              content
              priority
              completed
            }
          }
        `,
      }),
    })
      .then((res) => res.json())
      .then((data) => setTasks(data.data.tasks))
      .catch((err) => console.error("Error fetching tasks (GraphQL):", err));
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
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedData.id ? updatedData : t))
      );
    } catch (error) {
      console.error(error);
    }
  }

  return { tasks, fetchTasks, addTask, saveTask, deleteTask, toggleComplete };
}