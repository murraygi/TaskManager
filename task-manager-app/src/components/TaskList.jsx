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

  // Setup the intersection observer using useCallback
  const setupObserver = useCallback(() => {
    // Disconnect any existing observer
    if (observer.current) {
      observer.current.disconnect();
    }

    // Create a new observer
    observer.current = new IntersectionObserver(entries => {
      // If the loading element is visible and we have more items to load
      if (entries[0].isIntersecting && hasMore && !loading) {
        console.log("Intersection observer triggered loadMore");
        loadMore();
      }
    }, { 
      rootMargin: '100px' // Load more when element is 100px from viewport
    });

    // Observe the loading element if it exists
    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }
  }, [hasMore, loading, loadMore]);

  // Setup the observer when component mounts or dependencies change
  useEffect(() => {
    setupObserver();
    
    // Cleanup
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [setupObserver]);

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