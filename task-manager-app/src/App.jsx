import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TaskCreation from "./components/TaskCreation";
import TaskList from "./components/TaskList";
import TaskEditMode from "./components/TaskEditMode";
import { useTasks } from "./hooks/useTasks";

function App() {
  // 1) Decide if we are in REST or GraphQL from URL param
  const searchParams = new URLSearchParams(window.location.search);
  const initialMode = searchParams.get("api") === "graphql";
  const [useGraphQL, setUseGraphQL] = useState(initialMode);

  // 2) Toggle button
  function toggleMode() {
    const newMode = useGraphQL ? "rest" : "graphql";
    const params = new URLSearchParams(window.location.search);
    params.set("api", newMode);
    window.history.replaceState({}, "", `?${params.toString()}`);
    setUseGraphQL(!useGraphQL);
  }

  // 3) Our main tasks hook
  const {
    tasks,
    hasMore,
    loading,
    loadMore,
    addTask,
    saveTask,
    deleteTask,
    toggleComplete,
    createSubtask,
    toggleSubtaskComplete
  } = useTasks(useGraphQL);

  // 4) Edit state
  const [editingTaskId, setEditingTaskId] = useState(null);
  const editingTask = tasks.find((t) => t.id === editingTaskId);

  function editTask(id) {
    setEditingTaskId(id);
  }
  
  function cancelEdit() {
    setEditingTaskId(null);
  }
  
  // New function that wraps the saveTask function
  function handleSaveTask(id, taskData) {
    saveTask(id, taskData);
    setEditingTaskId(null); // Exit edit mode after saving
  }

  return (
    <div className="testMain">
      <Header />
      <button onClick={toggleMode}>
        Switch to {useGraphQL ? "REST" : "GraphQL"}
      </button>

      {/* Create new tasks */}
      <TaskCreation onAdd={addTask} />

      {/* If editing, show the edit form */}
      {editingTaskId ? (
        <TaskEditMode
          id={editingTaskId}
          task={editingTask}
          onSave={handleSaveTask}
          onCancel={cancelEdit}
        />
      ) : (
        <TaskList
          tasks={tasks}
          hasMore={hasMore}
          loading={loading}
          loadMore={loadMore}
          onEdit={editTask}
          onDelete={deleteTask}
          onToggleComplete={toggleComplete}
          onCreateSubtask={createSubtask}
          toggleSubtaskComplete={toggleSubtaskComplete}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;