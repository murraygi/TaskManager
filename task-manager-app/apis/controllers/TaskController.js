const Task = require("../rest/models/Task");
const Subtask = require("../rest/models/Subtask");

class TaskController {
  // Get paginated tasks with subtasks
  static async getTasksPaginated(page, limit) {
    const offset = (page - 1) * limit;
    try {
      const { rows, count } = await Task.findAndCountAll({
        limit,
        offset,
        order: [["createdAt", "ASC"]],
        include: [
          {
            model: Subtask,
            as: "subtasks",
          },
        ],
      });

      return { rows, total: count };
    } catch (error) {
      console.error("Error fetching paginated tasks:", error);
      throw error;
    }
  }

  // Generic findOne wrapper (used in tests / utilities)
  static async findOne(options) {
    return await Task.findOne(options);
  }

  // Get a single task by ID (with subtasks)
  static async getTaskById(id) {
    return await Task.findByPk(id, {
      include: [
        {
          model: Subtask,
          as: "subtasks",
        },
      ],
    });
  }

  // Create a new task
  static async createTask(data) {
    return await Task.create(data);
  }

  // Update an existing task
  static async updateTask(id, data) {
    const task = await Task.findByPk(id);
    if (!task) throw new Error("Task not found");
    return await task.update(data);
  }

  // Delete a task by ID
  static async deleteTask(id) {
    const task = await Task.findByPk(id);
    if (!task) throw new Error("Task not found");
    await task.destroy();
    return true;
  }
}

module.exports = TaskController;