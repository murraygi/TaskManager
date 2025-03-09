const Subtask = require("../rest/models/Subtask");

class SubtaskController {
  // Fetch paginated subtasks for a task
  static async getSubtasksPaginated(taskId, page, limit) {
    const offset = (page - 1) * limit;
    try {
      const { rows, count } = await Subtask.findAndCountAll({
        where: { taskId },
        limit,
        offset,
        order: [["createdAt", "ASC"]],
      });

      return { rows, total: count };
    } catch (error) {
      console.error("Error fetching paginated subtasks:", error);
      throw error;
    }
  }

  static async getSubtasksByTaskId(taskId) {
    try {
      return await Subtask.findAll({ where: { taskId } });
    } catch (error) {
      console.error("Error fetching subtasks for task:", error);
      throw error;
    }
  }

  static async getSubtaskById(id) {
    return await Subtask.findByPk(id);
  }

  static async createSubtask(data) {
    try {
      return await Subtask.create(data);
    } catch (error) {
      console.error("Error creating subtask:", error);
      throw error;
    }
  }

  static async updateSubtask(id, data) {
    try {
      const subtask = await Subtask.findByPk(id);
      if (!subtask) throw new Error("Subtask not found");
      return await subtask.update(data);
    } catch (error) {
      console.error("Error updating subtask:", error);
      throw error;
    }
  }

  static async deleteSubtask(id) {
    try {
      const subtask = await Subtask.findByPk(id);
      if (!subtask) throw new Error("Subtask not found");
      await subtask.destroy();
      return true;
    } catch (error) {
      console.error("Error deleting subtask:", error);
      throw error;
    }
  }
}

module.exports = SubtaskController;