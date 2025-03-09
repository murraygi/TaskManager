const { createSchema } = require('graphql-yoga');

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
      subtasks: [Subtask]
    }

    type Subtask {
      id: Int
      taskId: Int
      title: String
      content: String
      completed: Boolean
      createdAt: String
      updatedAt: String
    }

    # Pagination Response Types
    type TaskConnection {
      rows: [Task]
      total: Int
    }

    type SubtaskConnection {
      rows: [Subtask]
      total: Int
    }

    type Query {
      # Fetch paginated tasks
      tasks(page: Int, limit: Int): TaskConnection

      # Fetch a single task by ID (including subtasks)
      task(id: Int!): Task

      # Fetch paginated subtasks for a specific task
      subtasks(taskId: Int!, page: Int, limit: Int): SubtaskConnection
    }

    type Mutation {
      # Create a task
      createTask(
        title: String!
        content: String!
        priority: String
        completed: Boolean
      ): Task

      # Update a task
      updateTask(
        id: Int!
        title: String
        content: String
        priority: String
        completed: Boolean
      ): Task

      # Delete a task
      deleteTask(id: Int!): String

      # Create a subtask
      createSubtask(
        taskId: Int!
        title: String!
        content: String!
        completed: Boolean
      ): Subtask

      # Update a subtask
      updateSubtask(
        id: Int!
        title: String
        content: String
        completed: Boolean
      ): Subtask

      # Delete a subtask
      deleteSubtask(id: Int!): String
    }
  `,
});