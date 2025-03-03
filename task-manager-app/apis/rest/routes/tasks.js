const express = require('express');
const router = express.Router();
const TaskController = require("../../controllers/TaskController");

// GET all tasks
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { rows, total } = await TaskController.getTasksPaginated(page, limit);
    res.json({
      tasks: rows,
      total
    });
  } catch (error) {
    console.error("Error fetching paginated tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// POST a new task
router.post('/', async (req, res) => {
  try {
    const newTask = await TaskController.createTask(req.body);
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error saving to database:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// PUT (update) a task by ID
router.put('/:id', async (req, res) => {
  try {
    const task = await TaskController.getTaskById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    const updatedTask = await TaskController.updateTask(req.params.id, req.body);
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update task' });
  }
});

// DELETE a task by ID
router.delete('/:id', async (req, res) => {
  try {
    const task = await TaskController.getTaskById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    await TaskController.deleteTask(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;