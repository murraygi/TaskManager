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
  },
);