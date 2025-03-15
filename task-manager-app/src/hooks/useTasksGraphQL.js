// // hooks/useTasksGraphQL.js
// import { useState, useEffect, useCallback } from "react";

// export function useTasksGraphQL() {
//   const [tasks, setTasks] = useState([]);
//   const [totalTasks, setTotalTasks] = useState(0);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const limit = 10;  // Adjust as needed for larger scale testing

//   // Fetch first page on mount
//   useEffect(() => {
//     fetchTasks(page);
//   }, [page]);

//   // Fetch paginated tasks (including subtasks)
//   const fetchTasks = useCallback(async (pageNum) => {
//     if (loading || !hasMore) return; 
//     setLoading(true);

//     try {
//       //POST graphql with page and limit
//     const response = await fetch("http://localhost:5050/graphql", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         query: `
//             query ($page: Int, $limit: Int) {
//               tasks(page: $page, limit: $limit) {
//                 rows {
//                   id
//                   title
//                   content
//                   priority
//                   completed
//                   subtasks {  # Fetch subtasks
//                     id
//                     title
//                     completed
//                   }
//                 }
//                 total
//               }
//             }
//           `,
//           variables: { page: pageNum, limit },
//         }),
//       });
//       if (!response.ok) throw new Error("GraphQL request failed");
//       const result = await response.json();
//       const { rows, total } = result.data.tasks;

//       // append new tasks to existing list
//       setTasks((prev) => [...prev, ...rows]);
//       setTotalTasks(total);
//       setHasMore(rows.length === limit) 
//     } catch (error) {
//       console.error("Error fetching tasks (GraphQL):", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [loading, hasMore]);

//   // Load more when user scrolls down
//   const loadMore = () => {
//     if (hasMore) setPage((prev) => prev + 1);
//   };

//   // ADD TASK (GraphQL mutation) with Subtasks support
//   const addTask = async (newTask) => {
//     try {
//       const response = await fetch("http://localhost:5050/graphql", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           query: `
//             mutation($title: String!, $content: String!, $priority: String, $completed: Boolean) {
//               createTask(title: $title, content: $content, priority: $priority, completed: $completed) {
//                 id
//                 title
//                 content
//                 priority
//                 completed
//                 subtasks { 
//                   id
//                   title
//                   completed
//                 }
//               }
//             }
//           `,
//           variables: newTask,
//         }),
//       });
//       if (!response.ok) throw new Error("Failed to create task");
//       const result = await response.json();
//       setTasks((prev) => [...prev, result.data.createTask]);
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   // SAVE/UPDATE TASK and Subtasks
//   const saveTask = async (id, updatedTask) => {
//     try {
//       const response = await fetch("http://localhost:5050/graphql", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           query: `
//             mutation($id: Int!, $title: String, $content: String, $priority: String, $completed: Boolean) {
//               updateTask(id: $id, title: $title, content: $content, priority: $priority, completed: $completed) {
//                 id
//                 title
//                 content
//                 priority
//                 completed
//                 subtasks { 
//                   id
//                   title
//                   completed
//                 }
//               }
//             }
//           `,
//           variables: { id, ...updatedTask },
//         }),
//       });
//       if (!response.ok) throw new Error("Failed to update task");
//       const result = await response.json();
//       setTasks((prev) => prev.map((t) => (t.id === id ? result.data.updateTask : t)));
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   // DELETE TASK
//   const deleteTask = async (id) => {
//     try {
//       const response = await fetch("http://localhost:5050/graphql", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           query: `
//             mutation($id: Int!) {
//               deleteTask(id: $id)
//             }
//           `,
//           variables: { id },
//         }),
//       });
//       if (!response.ok) throw new Error("Failed to delete task");
//       // On success, remove from local state
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
//       const response = await fetch("http://localhost:5050/graphql", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           query: `
//             mutation($id: Int!, $completed: Boolean) {
//               updateTask(id: $id, completed: $completed) {
//                 id
//                 completed
//               }
//             }
//           `,
//           variables: { id, completed: newCompleted },
//         }),
//       });
//       if (!response.ok) throw new Error("Failed to toggle completion");
//       const result = await response.json();
//       setTasks((prev) => prev.map((t) => (t.id === id ? result.data.updateTask : t)));
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   const createSubtask = async (taskId, { title, content, completed }) => {
//     try {
//       const response = await fetch("http://localhost:5050/graphql", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           query: `
//             mutation ($taskId: Int!, $title: String!, $content: String!, $completed: Boolean) {
//               createSubtask(taskId: $taskId, title: $title, content: $content, completed: $completed) {
//                 id
//                 title
//                 content
//                 completed
//               }
//             }
//           `,
//           variables: { taskId, title, content, completed },
//         }),
//       });
//       if (!response.ok) throw new Error("Failed to create subtask");
//       const result = await response.json();
//       const createdSub = result.data.createSubtask;
  
//       // Insert this subtask into the correct task
//       setTasks((prev) =>
//         prev.map((t) => {
//           if (t.id === taskId) {
//             const updatedSubs = t.subtasks ? [...t.subtasks, createdSub] : [createdSub];
//             return { ...t, subtasks: updatedSubs };
//           }
//           return t;
//         })
//       );
//     } catch (error) {
//       console.error("Error creating subtask (GraphQL):", error);
//     }
//   };

//   return { tasks, loadMore, hasMore, loading, addTask, saveTask, deleteTask, toggleComplete, createSubtask };
// }