const { createSchema } = require('graphql-yoga');
const TaskController = require('../controllers/TaskController');

module.exports = createSchema({
  typeDefs: `
    type Task {
      id: Int
      title: String
      content: String
      priority: String
      completed: Boolean
      createdAt: String
      updatedAt: String
    }

    # Pagination Response Type
    type TaskConnection {
      rows: [Task]  # Paginated list of tasks
      total: Int    # Total count of tasks
    }

    type Query {
      # Fetch paginated tasks (instead of all tasks at once)
      tasks(page: Int, limit: Int): TaskConnection

      # Fetch a single task by ID
      task(id: Int!): Task
    }

    type Mutation {
      # Create a new task (completed is optional; default is false in your Sequelize model)
      createTask(
        title: String!
        content: String!
        priority: String
        completed: Boolean
      ): Task
      
      # Update an existing task
      updateTask(
        id: Int!
        title: String
        content: String
        priority: String
        completed: Boolean
      ): Task
      
      # Delete a task
      deleteTask(id: Int!): String
    }
  `,
    Mutation: {
      createTask: async (_, { title, content, priority, completed }) => {
        // Pass the completed field if provided; your model may default it to false if omitted
        return TaskController.createTask({ title, content, priority, completed });
      },
      updateTask: async (_, { id, ...updates }) => {
        // updates could include completed, title, content, or priority
        return TaskController.updateTask(id, updates);
      },
      deleteTask: async (_, { id }) => {
        await TaskController.deleteTask(id);
        return `Task ${id} deleted`;
      },
    },
  },
);