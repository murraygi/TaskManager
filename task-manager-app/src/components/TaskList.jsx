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
  // IntersectionObserver to auto load more tasks as you scroll
  const observer = useRef();
  // Reference to the loading element at the bottom of the list
  const loadingRef = useRef();

useEffect(() => {
  let timeout = null;

  // Clean up any existing observer
  if (observer.current) {
    observer.current.disconnect();
  }

  //Set up a new IntersectionObserver
  observer.current = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && hasMore && !loading) {
      //Only trigger once every 500ms (basic debounce)
      if (!timeout) {
        console.log("Intersection observer triggered loadMore");
        loadMore();

        timeout = setTimeout(() => {
          timeout = null;
        }, 500);
      }
    }
  }, {
    rootMargin: '100px' // Start loading before hitting the bottom
  });

  // Attach observer to the loading element
  if (loadingRef.current) {
    observer.current.observe(loadingRef.current);
  }

  // Cleanup on unmount
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
          // Show Incomplete tasks first
          if (!a.completed && b.completed) return -1;
          if (a.completed && !b.completed) return 1;
          // Then sort by createdAt (oldest first)
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

      {/* Bottom of list Loading indicator - this element is watched by the observer */}
      <div ref={loadingRef} className="loading-indicator">
        {loading && <p>Loading more tasks...</p>}
        {!hasMore && <p>No more tasks to load</p>}
        {!loading && hasMore && <p>Scroll for more...</p>}
      </div>
    </div>
  );
}

export default TaskList;