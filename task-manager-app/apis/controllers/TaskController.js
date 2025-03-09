const Task = require("../rest/models/Task");

class TaskController {
  static async getTasksPaginated(page, limit) {
    const offset = (page - 1) * limit;
    try {
      const { rows, count } = await Task.findAndCountAll({
        limit,
        offset,
        order: [["createdAt", "ASC"]],
      });

      return { rows, total: count };
    } catch (error) {
      console.error("Error fetching paginated tasks:", error);
      throw error;
    }
  }
  static async findOne(options) {
    return await Task.findOne(options);
  }

  static async getTaskById(id) {
    return await Task.findByPk(id);
  }

  static async createTask(data) {
    return await Task.create(data);
  }

  static async updateTask(id, data) {
    const task = await Task.findByPk(id);
    if (!task) throw new Error("Task not found");
    return await task.update(data);
  }

  static async deleteTask(id) {
    const task = await Task.findByPk(id);
    if (!task) throw new Error("Task not found");
    await task.destroy();
    return true;
  }
}

module.exports = TaskController;