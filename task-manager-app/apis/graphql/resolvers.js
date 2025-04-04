const TaskController = require("../controllers/TaskController");
const SubtaskController = require("../controllers/SubtaskController");

const resolvers = {
  Query: {
    // Get all tasks (paginated)
    tasks: async (_, { page = 1, limit = 10 }) => {
      const { rows, total } = await TaskController.getTasksPaginated(page, limit);
      return { rows, total };
    },

    // Get a single task by ID
    task: async (_, { id }) => {
      return await TaskController.getTaskById(id);
    },

    // Get subtasks for a task (paginated)
    subtasks: async (_, { taskId, page = 1, limit = 10 }) => {
      return await SubtaskController.getSubtasksPaginated(taskId, page, limit);
    },
  },

  // Used when resolving nested subtasks inside a Task
  Task: {
    subtasks: (parent) => parent.subtasks,
  },

  Mutation: {
    // Create a task (with optional subtasks)
    createTask: async (_, { title, content, priority, completed, subtasks = [] }) => {
      // Step 1: Create the main task
      const createdTask = await TaskController.createTask({ title, content, priority, completed });

      // Step 2: Create subtasks if any exist
      if (subtasks.length > 0) {
        await Promise.all(
          subtasks.map((st) =>
            SubtaskController.createSubtask({
              taskId: createdTask.id,
              title: st.title,
              content: st.content,
              completed: !!st.completed,
            })
          )
        );
      }

      // Step 3: Fetch and return the task again, now with subtasks included
      return await TaskController.getTaskById(createdTask.id);
    },

    // Update task by ID
    updateTask: async (_, { id, ...updates }) => {
      return await TaskController.updateTask(id, updates);
    },

    // Delete task by ID
    deleteTask: async (_, { id }) => {
      await TaskController.deleteTask(id);
      return `Task ${id} deleted`;
    },

    // Create a subtask linked to a task
    createSubtask: async (_, { taskId, title, content, completed }) => {
      return await SubtaskController.createSubtask({ taskId, title, content, completed });
    },

    // Update subtask by ID
    updateSubtask: async (_, { id, ...updates }) => {
      return await SubtaskController.updateSubtask(id, updates);
    },

    // Delete subtask by ID
    deleteSubtask: async (_, { id }) => {
      await SubtaskController.deleteSubtask(id);
      return `Subtask ${id} deleted`;
    },
  },
};

module.exports = resolvers;