const { createSchema } = require('graphql-yoga');

module.exports = createSchema({
  typeDefs: `
    # -----------------------------
    # Types
    # -----------------------------

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

    # -----------------------------
    # Pagination Response Types
    # -----------------------------

    type TaskConnection {
      rows: [Task]
      total: Int
    }

    type SubtaskConnection {
      rows: [Subtask]
      total: Int
    }

    # -----------------------------
    # Queries
    # -----------------------------

    type Query {
      # Get paginated tasks (includes subtasks)
      tasks(page: Int, limit: Int): TaskConnection

      # Get a specific task by ID
      task(id: Int!): Task

      # Get paginated subtasks for a task
      subtasks(taskId: Int!, page: Int, limit: Int): SubtaskConnection
    }

    # -----------------------------
    # Input Types
    # -----------------------------

    input SubtaskInput {
      title: String!
      content: String
      completed: Boolean
    }

    # -----------------------------
    # Mutations
    # -----------------------------

    type Mutation {
      # Create a task (optionally with subtasks)
      createTask(
        title: String!
        content: String
        priority: String
        completed: Boolean
        subtasks: [SubtaskInput]
      ): Task

      # Update a task
      updateTask(
        id: Int!
        title: String
        content: String
        priority: String
        completed: Boolean
      ): Task

      # Delete a task by ID
      deleteTask(id: Int!): String

      # Create a single subtask
      createSubtask(
        taskId: Int!
        title: String!
        content: String
        completed: Boolean
      ): Subtask

      # Update a subtask
      updateSubtask(
        id: Int!
        title: String
        content: String
        completed: Boolean
      ): Subtask

      # Delete a subtask by ID
      deleteSubtask(id: Int!): String
    }
  `,
});