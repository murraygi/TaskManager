const TaskController = require('../controllers/TaskController');

const resolvers = {
  Query: {
    tasks: async () => await TaskController.getAllTasks(),
    task: async (_, { id }) => await TaskController.getTaskById(id),
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