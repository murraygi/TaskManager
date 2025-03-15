import React, { useEffect, useRef } from "react";
import Task from "./Task";

function TaskList({ tasks, onToggleComplete, onDelete, onEdit, loadMore, hasMore, loading, onCreateSubtask }) {
  const observerRef = useRef(); // Ref for detecting scrolling

  useEffect(() => {
    function handleScroll() {
      // Check if the user is near the bottom of the page
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        hasMore && !loading
      ) {
        loadMore(); // Load more tasks when scrolling near the bottom
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  return (
    <div>
      {tasks
        .slice() // Copy array to prevent mutations
        .sort((a, b) => {
          //incomplete always before completed
          if (!a.completed && b.completed) return -1;
          if (a.completed && !b.completed) return 1;

          //if both have the same completed status, sort by createdAt ascending
          return new Date(a.createdAt) - new Date(b.createdAt);
        })
        .map((taskItem) => (
          <Task
            key={taskItem.id}
            id={taskItem.id}
            title={taskItem.title}
            content={taskItem.content}
            priority={taskItem.priority}
            completed={taskItem.completed}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            onEdit={() => onEdit(taskItem.id)}
            subtasks={taskItem.subtasks || []}
            onCreateSubtask={onCreateSubtask}
          />
        ))}

      {/* Loading indicator when fetching more tasks */}
      {loading && <p>Loading more tasks...</p>}

      {/* No more tasks message */}
      {!hasMore && <p>No more tasks to load</p>}
    </div>
  );
}

export default TaskList;