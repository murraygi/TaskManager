const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST a new task
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // Check if the task already exists
    const existingTask = await Task.findOne({
      where: {
        title,
        content
      }
    });

    if (existingTask) {
      return res.status(400).json({ error: 'Task already exists' });
    }

    const newTask = await Task.create(req.body);
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error saving to database:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// PUT (update) a task by ID
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    const updatedTask = await task.update(req.body);
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update task' });
  }
});

// DELETE a task by ID
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    await task.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;