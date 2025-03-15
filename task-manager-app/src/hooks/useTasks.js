import { useState, useEffect, useCallback } from "react";

// isGraphQL = boolean that flips between REST & GraphQL
export function useTasks(isGraphQL) {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const limit = 10; // Adjust as needed

  // On mount or page change, fetch tasks
  useEffect(() => {
    setTasks([]);
    setPage(1);
  }, [isGraphQL]);

  const fetchTasks = useCallback(async (pageNum) => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      if (!isGraphQL) {
        // REST
        const response = await fetch(`http://localhost:5050/api/tasks?page=${pageNum}&limit=${limit}`);
        if (!response.ok) throw new Error("Failed to fetch tasks (REST)");
        const result = await response.json(); // e.g. { tasks:[...], total: number }
        const { tasks, total } = result;
        setTasks((prev) => {
          const newArr = [...prev, ...tasks];
          setHasMore(newArr.length < total);
          return newArr;
        });
      } else {
        // GraphQL
        const response = await fetch("http://localhost:5050/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query($page: Int, $limit: Int) {
                tasks(page: $page, limit: $limit) {
                  rows {
                    id
                    title
                    content
                    priority
                    completed
                    subtasks {
                      id
                      title
                      completed
                    }
                  }
                  total
                }
              }
            `,
            variables: { page: pageNum, limit },
          }),
        });
        if (!response.ok) throw new Error("Failed to fetch tasks (GraphQL)");
        const result = await response.json();
        const { rows, total } = result.data.tasks;
        setTasks((prev) => {
          const newArr = [...prev, ...rows];
          setHasMore(newArr.length < total);
          return newArr;
        });
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }, [isGraphQL, loading, hasMore]);

  // For "Load More" button or infinite scroll
  const loadMore = () => {
    if (hasMore) setPage((prev) => prev + 1);
  };

  const addTask = async (newTask) => {
    if (!isGraphQL) {
      // REST
      try {
        const response = await fetch("http://localhost:5050/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTask),
        });
        if (!response.ok) throw new Error("Failed to create task (REST)");
        const createdTask = await response.json();
        setTasks((prev) => [...prev, createdTask]);
      } catch (err) {
        console.error(err);
      }
    } else {
      // GraphQL
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
                  subtasks {
                    id
                    title
                    completed
                  }
                }
              }
            `,
            variables: newTask,
          }),
        });
        if (!response.ok) throw new Error("Failed to create task (GraphQL)");
        const result = await response.json();
        const newCreated = result.data.createTask;
        setTasks((prev) => [...prev, newCreated]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const saveTask = async (id, updatedTask) => {
    if (!isGraphQL) {
      // REST
      try {
        const response = await fetch(`http://localhost:5050/api/tasks/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTask),
        });
        if (!response.ok) throw new Error("Failed to update task (REST)");
        const updatedData = await response.json();
        setTasks((prev) => prev.map((t) => (t.id === updatedData.id ? updatedData : t)));
      } catch (err) {
        console.error(err);
      }
    } else {
      // GraphQL
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
                  subtasks { id title completed }
                }
              }
            `,
            variables: { id, ...updatedTask },
          }),
        });
        if (!response.ok) throw new Error("Failed to update task (GraphQL)");
        const result = await response.json();
        const updated = result.data.updateTask;
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const deleteTask = async (id) => {
    if (!isGraphQL) {
      // REST
      try {
        const response = await fetch(`http://localhost:5050/api/tasks/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete task (REST)");
        setTasks((prev) => prev.filter((t) => t.id !== id));
      } catch (err) {
        console.error(err);
      }
    } else {
      // GraphQL
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
        if (!response.ok) throw new Error("Failed to delete task (GraphQL)");
        // On success, remove from local
        setTasks((prev) => prev.filter((t) => t.id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const createSubtask = async (taskId, { title, content, completed }) => {
    if (!isGraphQL) {
      // REST
      try {
        const response = await fetch("http://localhost:5050/api/subtasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskId, title, content, completed }),
        });
        if (!response.ok) throw new Error("Failed to create subtask (REST)");
        const createdSub = await response.json();
        setTasks((prev) =>
          prev.map((t) => {
            if (t.id === taskId) {
              const newSubs = t.subtasks ? [...t.subtasks, createdSub] : [createdSub];
              return { ...t, subtasks: newSubs };
            }
            return t;
          })
        );
      } catch (err) {
        console.error(err);
      }
    } else {
      // GraphQL
      try {
        const response = await fetch("http://localhost:5050/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              mutation($taskId: Int!, $title: String!, $content: String!, $completed: Boolean) {
                createSubtask(taskId: $taskId, title: $title, content: $content, completed: $completed) {
                  id
                  title
                  content
                  completed
                }
              }
            `,
            variables: { taskId, title, content, completed },
          }),
        });
        if (!response.ok) throw new Error("Failed to create subtask (GraphQL)");
        const result = await response.json();
        const createdSub = result.data.createSubtask;
        setTasks((prev) =>
          prev.map((t) => {
            if (t.id === taskId) {
              const newSubs = t.subtasks ? [...t.subtasks, createdSub] : [createdSub];
              return { ...t, subtasks: newSubs };
            }
            return t;
          })
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  return {
    tasks,
    hasMore,
    loading,
    loadMore,
    addTask,
    saveTask,
    deleteTask,
    createSubtask,
    toggleComplete: async (id) => {
      // Same pattern as save or update
      if (!isGraphQL) {
        // REST PUT
        const target = tasks.find((t) => t.id === id);
        if (!target) return;
        const newCompleted = !target.completed;
        try {
          const response = await fetch(`http://localhost:5050/api/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: newCompleted }),
          });
          if (!response.ok) throw new Error("Failed to toggle completion (REST)");
          const updatedData = await response.json();
          setTasks((prev) => prev.map((t) => t.id === id ? updatedData : t));
        } catch (err) {
          console.error(err);
        }
      } else {
        // GraphQL
        try {
          const target = tasks.find((t) => t.id === id);
          if (!target) return;
          const newCompleted = !target.completed;
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
          if (!response.ok) throw new Error("Failed to toggle completion (GraphQL)");
          const result = await response.json();
          const updatedData = result.data.updateTask;
          setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: updatedData.completed } : t)));
        } catch (err) {
          console.error(err);
        }
      }
    },
  };
}