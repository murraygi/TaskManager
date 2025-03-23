const TaskController = require("../controllers/TaskController");
const SubtaskController = require("../controllers/SubtaskController");

const resolvers = {
  Query: {
    // Fetch paginated tasks
    tasks: async (_, { page = 1, limit = 10 }) => {
      const { rows, total } = await TaskController.getTasksPaginated(page, limit);
      return { rows, total };
    },
    
    // Fetch a single task by ID
    task: async (_, { id }) => {
      return await TaskController.getTaskById(id);
    },

    // Fetch paginated subtasks for a task
    subtasks: async (_, { taskId, page = 1, limit = 10 }) => {
      return await SubtaskController.getSubtasksPaginated(taskId, page, limit);
    },
  },

  Task: {
    subtasks: (parent) => parent.subtasks
  },

  Mutation: {
    createTask: async (_, { title, content, priority, completed }) => {
      return await TaskController.createTask({ title, content, priority, completed });
    },

    updateTask: async (_, { id, ...updates }) => {
      return await TaskController.updateTask(id, updates);
    },

    deleteTask: async (_, { id }) => {
      await TaskController.deleteTask(id);
      return `Task ${id} deleted`;
    },

    createSubtask: async (_, { taskId, title, content, completed }) => {
      return await SubtaskController.createSubtask({ taskId, title, content, completed });
    },

    updateSubtask: async (_, { id, ...updates }) => {
      return await SubtaskController.updateSubtask(id, updates);
    },

    deleteSubtask: async (_, { id }) => {
      await SubtaskController.deleteSubtask(id);
      return `Subtask ${id} deleted`;
    },
  },
};

module.exports = resolvers;