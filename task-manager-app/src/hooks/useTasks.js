import { useState, useEffect, useCallback, useRef } from "react";

export function useTasks(isGraphQL) {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);

  const limit = 1000;

  function deduplicateTasks(taskArray) {
    return Array.from(new Map(taskArray.map((t) => [t.id, t])).values());
  }

  const fetchTasks = useCallback(
    async (currentPage) => {
      if (loadingRef.current || !hasMore) return;
      loadingRef.current = true;
      setLoading(true);

      try {
        if (!isGraphQL) {
          // --- REST ---
          const response = await fetch(
            `http://localhost:5050/api/tasks?page=${currentPage}&limit=${limit}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch tasks (REST)");
          }
          const data = await response.json();
          const { tasks: newTasks, total } = data;

          setTasks((prev) => {
            const combined = [...prev, ...newTasks];
            const unique = deduplicateTasks(combined);
            if (unique.length >= total) {
              setHasMore(false);
            }
            return unique;
          });
        } else {
          // --- GraphQL ---
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
              variables: { page: currentPage, limit },
            }),
          });
          if (!response.ok) {
            throw new Error("Failed to fetch tasks (GraphQL)");
          }
          const result = await response.json();
          if (result.errors) {
            throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
          }

          const { rows, total } = result.data.tasks;
          setTasks((prev) => {
            const combined = [...prev, ...rows];
            const unique = deduplicateTasks(combined);
            if (unique.length >= total) {
              setHasMore(false);
            }
            return unique;
          });
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [isGraphQL, hasMore]
  );

  useEffect(() => {
    loadingRef.current = false;
    setTasks([]);
    setLoading(false);
    setHasMore(true);
    setPage(1);
  }, [isGraphQL]);

  useEffect(() => {
    if (page > 0 && !loadingRef.current) {
      fetchTasks(page);
    }
  }, [page, fetchTasks]);

  function loadMore() {
    if (!loadingRef.current && hasMore) {
      setPage((old) => old + 1);
    }
  }

  // ---------------------------------
  //  CREATE / UPDATE / DELETE TASKS
  // ---------------------------------

  // a) Add new task (single or multiple subtasks if GraphQL)
  async function addTask(newTask) {
    try {
      if (!isGraphQL) {
        // Step 1 - Create the main task
        const taskRes = await fetch("http://localhost:5050/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newTask.title,
            content: newTask.content,
            priority: newTask.priority,
            completed: newTask.completed || false,
          }),
        });
  
        if (!taskRes.ok) throw new Error("Failed to add task (REST)");
  
        const createdTask = await taskRes.json();
  
        // Step 2 - Create subtasks (if any)
        const subtasks = newTask.subtasks || [];
        const createdSubtasks = [];
  
        for (const subtask of subtasks) {
          const subRes = await fetch("http://localhost:5050/api/subtasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              taskId: createdTask.id,
              title: subtask.title,
              content: subtask.content,
              completed: !!subtask.completed,
            }),
          });
  
          if (subRes.ok) {
            const created = await subRes.json();
            createdSubtasks.push(created);
          } else {
            console.warn("Failed to add subtask:", subtask.title);
          }
        }
  
        // Step 3 - Update state with task + subtasks
        setTasks((prev) =>
          deduplicateTasks([
            ...prev,
            { ...createdTask, subtasks: createdSubtasks },
          ])
        );      
      } else {
        // --- GraphQL ---
        const response = await fetch("http://localhost:5050/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              mutation(
                $title: String!,
                $content: String,
                $priority: String,
                $completed: Boolean,
                $subtasks: [SubtaskInput]
              ) {
                createTask(
                  title: $title,
                  content: $content,
                  priority: $priority,
                  completed: $completed,
                  subtasks: $subtasks
                ) {
                  id
                  title
                  content
                  priority
                  completed
                  subtasks {
                    id
                    title
                    content
                    completed
                  }
                }
              }
            `,
            variables: newTask,
          }),
        });
        if (!response.ok) throw new Error("Failed to add task (GraphQL)");
        const result = await response.json();
        if (result.errors) {
          throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
        }
        const created = result.data.createTask;
        setTasks((prev) => deduplicateTasks([...prev, created]));
      }
    } catch (err) {
      console.error(err);
    }
  }

  // b) Update an existing task
  async function saveTask(id, updatedTask) {
    try {
      if (!isGraphQL) {
        const res = await fetch(`http://localhost:5050/api/tasks/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTask),
        });
        if (!res.ok) throw new Error("Failed to update task (REST)");
        const updated = await res.json();
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
        );
      } else {
        const res = await fetch("http://localhost:5050/graphql", {
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
        if (!res.ok) throw new Error("Failed to update task (GraphQL)");
        const result = await res.json();
        if (result.errors) {
          throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
        }
        const updated = result.data.updateTask;
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  // c) Delete a task
  async function deleteTask(id) {
    try {
      if (!isGraphQL) {
        const res = await fetch(`http://localhost:5050/api/tasks/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete task (REST)");
        setTasks((prev) => prev.filter((t) => t.id !== id));
      } else {
        const res = await fetch("http://localhost:5050/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `mutation($id: Int!) { deleteTask(id: $id) }`,
            variables: { id },
          }),
        });
        if (!res.ok) throw new Error("Failed to delete task (GraphQL)");
        const result = await res.json();
        if (result.errors) {
          throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
        }
        setTasks((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  }

  // d) Toggle main task complete
  async function toggleComplete(id) {
    try {
      const target = tasks.find((t) => t.id === id);
      if (!target) return;
      const newCompleted = !target.completed;

      if (!isGraphQL) {
        const res = await fetch(`http://localhost:5050/api/tasks/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: newCompleted }),
        });
        if (!res.ok) throw new Error("Failed to toggle completion (REST)");
        const updated = await res.json();
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      } else {
        const res = await fetch("http://localhost:5050/graphql", {
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
        if (!res.ok) throw new Error("Failed to toggle completion (GraphQL)");
        const result = await res.json();
        if (result.errors) {
          throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
        }
        const updated = result.data.updateTask;
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, completed: updated.completed } : t))
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  // e) Create subtask (standalone for existing tasks)
  async function createSubtask(taskId, subtaskData) {
    try {
      if (!isGraphQL) {
        const res = await fetch("http://localhost:5050/api/subtasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskId, ...subtaskData }),
        });
        if (!res.ok) throw new Error("Failed to create subtask (REST)");
        const created = await res.json();
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, subtasks: [...(t.subtasks || []), created] }
              : t
          )
        );
      } else {
        const res = await fetch("http://localhost:5050/graphql", {
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
            variables: { taskId, ...subtaskData },
          }),
        });
        if (!res.ok) throw new Error("Failed to create subtask (GraphQL)");
        const result = await res.json();
        if (result.errors) {
          throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
        }
        const created = result.data.createSubtask;
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, subtasks: [...(t.subtasks || []), created] }
              : t
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  // f) Toggle subtask complete
  async function toggleSubtaskComplete(taskId, subtaskId, currentCompleted) {
    const newCompleted = !currentCompleted;
    try {
      if (!isGraphQL) {
        const res = await fetch(`http://localhost:5050/api/subtasks/${subtaskId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: newCompleted }),
        });
        if (!res.ok) throw new Error("Failed to toggle subtask (REST)");
        const updated = await res.json();
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: t.subtasks?.map((st) => (st.id === subtaskId ? updated : st)),
                }
              : t
          )
        );
      } else {
        const res = await fetch("http://localhost:5050/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              mutation($id: Int!, $completed: Boolean) {
                updateSubtask(id: $id, completed: $completed) {
                  id
                  title
                  content
                  completed
                }
              }
            `,
            variables: { id: subtaskId, completed: newCompleted },
          }),
        });
        if (!res.ok) throw new Error("Failed to toggle subtask (GraphQL)");
        const result = await res.json();
        if (result.errors) {
          throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
        }
        const updated = result.data.updateSubtask;
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: t.subtasks?.map((st) => (st.id === subtaskId ? updated : st)),
                }
              : t
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  return {
    tasks,
    hasMore,
    loading,
    loadMore,
    addTask,
    saveTask,
    deleteTask,
    toggleComplete,
    createSubtask,
    toggleSubtaskComplete,
  };
}