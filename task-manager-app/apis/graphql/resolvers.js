const TaskController = require('../controllers/TaskController');

const resolvers = {
  Query: {
    // accepts `page` and `limit` for paginated fetching
    tasks: async (_, { page = 1, limit = 10 }) => {
      return await TaskController.getTasksPaginated(page, limit);
    },
    
    // Fetch a single task by ID
    task: async (_, { id }) => {
      return await TaskController.getTaskById(id);
    },
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
  },
};

module.exports = resolvers;