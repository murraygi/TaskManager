import React, { useEffect, useRef, useCallback } from "react";
import Task from "./Task";

function TaskList({
  tasks,
  onToggleComplete,
  onDelete,
  onEdit,
  loadMore,
  hasMore,
  loading,
  onCreateSubtask,
  toggleSubtaskComplete
}) {
  // Observer ref for the loading element
  const observer = useRef();
  // Reference to the loading element
  const loadingRef = useRef();

  // REPLACEMENT: Throttled IntersectionObserver
useEffect(() => {
  let timeout = null;

  if (observer.current) {
    observer.current.disconnect();
  }

  observer.current = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && hasMore && !loading) {
      if (!timeout) {
        console.log("Intersection observer triggered loadMore");
        loadMore();

        timeout = setTimeout(() => {
          timeout = null;
        }, 500); // prevent spam by waiting 500ms
      }
    }
  }, {
    rootMargin: '100px'
  });

  if (loadingRef.current) {
    observer.current.observe(loadingRef.current);
  }

  return () => {
    if (observer.current) {
      observer.current.disconnect();
    }
    if (timeout) {
      clearTimeout(timeout);
    }
  };
}, [hasMore, loading, loadMore]);

  return (
    <div className="task-list">
      {tasks
        .slice()
        .sort((a, b) => {
          // Incomplete first
          if (!a.completed && b.completed) return -1;
          if (a.completed && !b.completed) return 1;
          // Then by createdAt ascending
          const aDate = new Date(a.createdAt || 0);
          const bDate = new Date(b.createdAt || 0);
          return aDate - bDate;
        })
        .map((task) => (
          <Task
            key={task.id}
            {...task}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            onEdit={() => onEdit(task.id)}
            onCreateSubtask={onCreateSubtask}
            toggleSubtaskComplete={toggleSubtaskComplete}
          />
        ))}

      {/* Loading indicator - this element is observed */}
      <div ref={loadingRef} className="loading-indicator">
        {loading && <p>Loading more tasks...</p>}
        {!hasMore && <p>No more tasks to load</p>}
        {!loading && hasMore && <p>Scroll for more...</p>}
      </div>
    </div>
  );
}

export default TaskList;