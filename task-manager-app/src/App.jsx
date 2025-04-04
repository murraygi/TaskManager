import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TaskCreation from "./components/TaskCreation";
import TaskList from "./components/TaskList";
import TaskEditMode from "./components/TaskEditMode";
import { useTasks } from "./hooks/useTasks";

function App() {
  // 1) Figure out if we are in REST or GraphQL based on the URL param
  const searchParams = new URLSearchParams(window.location.search);
  const initialMode = searchParams.get("api") === "graphql";
  const [useGraphQL, setUseGraphQL] = useState(initialMode);

  // 2) Toggle button for REST and GraohQL that updates the URL
  function toggleMode() {
    const newMode = useGraphQL ? "rest" : "graphql";
    const params = new URLSearchParams(window.location.search);
    params.set("api", newMode);
    window.history.replaceState({}, "", `?${params.toString()}`);
    setUseGraphQL(!useGraphQL);
  }

  // 3) Hook for fetching tasks (depending on REST or GraphQL mode)
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

  // 4) Edit state - tracks which task (if any) is being edited
  const [editingTaskId, setEditingTaskId] = useState(null);
  const editingTask = tasks.find((t) => t.id === editingTaskId);

  function editTask(id) {
    setEditingTaskId(id);
  }
  
  function cancelEdit() {
    setEditingTaskId(null);
  }
  
  // Called when a task is saved
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

      {/* Form to create new tasks */}
      <TaskCreation onAdd={addTask} />

      {/* If editing, show the edit form, otherwise show the task list */}
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