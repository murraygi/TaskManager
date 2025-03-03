import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TaskCreation from "./components/TaskCreation";
import TaskList from "./components/TaskList";
import TaskEditMode from "./components/TaskEditMode";
import { useTasksREST } from "./hooks/useTasksREST";
import { useTasksGraphQL } from "./hooks/useTasksGraphQL";

function App() {
  // Toggle state: if true, use GraphQL; else use REST
  const [useGraphQL, setUseGraphQL] = useState(false);

  // Destructure from the relevant hook
  const {
    tasks,
    addTask,
    toggleComplete,
    deleteTask,
    saveTask,
    loadMore,
    hasMore,
    loading
  } = useGraphQL ? useTasksGraphQL() : useTasksREST();
  

  // For editing tasks
  const [editingTaskId, setEditingTaskId] = useState(null);

  function editTask(id) {
    setEditingTaskId(id);
  }
  function cancelEdit() {
    setEditingTaskId(null);
  }

  // Find the task that is currently being edited
  const editingTask = tasks.find((task) => task.id === editingTaskId);
  
  return (
    <div className="testMain">
      <Header />
      <button onClick={() => setUseGraphQL(!useGraphQL)}>
        Switch to {useGraphQL ? "REST" : "GraphQL"}
      </button>
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
        loadMore={loadMore}
        hasMore={hasMore}
        loading={loading}
        />
      )}
      <Footer />
    </div>
  );
}

export default App;