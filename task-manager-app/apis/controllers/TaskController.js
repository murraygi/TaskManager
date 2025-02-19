const Task = require("../models/Task");

class TaskController {
  static async getAllTasks() {
    return await Task.findAll();
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