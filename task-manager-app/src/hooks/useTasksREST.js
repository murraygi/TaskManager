// import { useState, useEffect, useCallback } from "react";

// export function useTasksREST() {
//   const [tasks, setTasks] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const limit = 10; // Number of tasks per page

//   // Fetch first page on mount
//   useEffect(() => {
//     fetchTasks(page);
//   }, [page]);

//   // Fetch tasks by page
//   const fetchTasks = useCallback(async (pageNum) => {
//     if (loading || !hasMore) return; // Prevent duplicate calls
//     setLoading(true);

//     try {
//       const response = await fetch(`http://localhost:5050/api/tasks?page=${pageNum}&limit=${limit}`);
//       if (!response.ok) throw new Error("Failed to fetch tasks");

//       const result = await response.json();
//       const { tasks, total } = result;

//       setTasks((prev) => [...prev, ...tasks]);

//       setHasMore((prevArray) => {
//         const newLength = prevArray.length + tasks.length;
//         return newLength < total; 
//       });

//     } catch (error) {
//       console.error("Error fetching tasks (REST):", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [loading, hasMore]);

//   const loadMore = () => {
//     if (hasMore) setPage((prev) => prev + 1);
//   };

//   // ADD TASK
//   const addTask = async (newTask) => {
//     try {
//       const response = await fetch("http://localhost:5050/api/tasks", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newTask),
//       });
//       if (!response.ok) throw new Error("Failed to create task");
//       const createdTask = await response.json();
//       setTasks((prev) => [...prev, createdTask]);
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   // SAVE/UPDATE TASK
//   const saveTask = async (id, updatedTask) => {
//     try {
//       const response = await fetch(`http://localhost:5050/api/tasks/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedTask),
//       });
//       if (!response.ok) throw new Error("Failed to update task");
//       const updatedData = await response.json();
//       setTasks((prev) =>
//         prev.map((t) => (t.id === updatedData.id ? updatedData : t))
//       );
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   // DELETE TASK
//   const deleteTask = async (id) => {
//     try {
//       const response = await fetch(`http://localhost:5050/api/tasks/${id}`, {
//         method: "DELETE",
//       });
//       if (!response.ok) throw new Error("Failed to delete task");
//       setTasks((prev) => prev.filter((t) => t.id !== id));
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   // TOGGLE COMPLETE
//   const toggleComplete = async (id) => {
//     const targetTask = tasks.find((t) => t.id === id);
//     if (!targetTask) return;
//     const newCompleted = !targetTask.completed;

//     try {
//       const response = await fetch(`http://localhost:5050/api/tasks/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ completed: newCompleted }),
//       });
//       if (!response.ok) throw new Error("Failed to toggle completion");
//       const updatedData = await response.json();
//       setTasks((prev) => prev.map((t) => (t.id === updatedData.id ? updatedData : t)));
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   const createSubtask = async (taskId, newSubtask) => {
//     try {
//       const response = await fetch("http://localhost:5050/api/subtasks", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ taskId, ...newSubtask }),
//       });
//       if (!response.ok) throw new Error("Failed to create subtask");
//       const createdSub = await response.json();
  
//       // Update local state: find the task, append the subtask
//       setTasks((prev) =>
//         prev.map((t) => {
//           if (t.id === taskId) {
//             // Insert new subtask into t.subtasks (which might be missing or empty)
//             const updatedSubtasks = t.subtasks ? [...t.subtasks, createdSub] : [createdSub];
//             return { ...t, subtasks: updatedSubtasks };
//           }
//           return t;
//         })
//       );
//     } catch (error) {
//       console.error("Error creating subtask:", error);
//     }
//   };

//   return { tasks, loadMore, hasMore, loading, addTask, saveTask, deleteTask, toggleComplete, createSubtask };
// }