// routes/subtasks.js
const express = require('express');
const router = express.Router();
const SubtaskController = require("../../controllers/SubtaskController");

// GET paginated subtasks with query ?taskId=1&page=1&limit=5
router.get('/', async (req, res) => {
  try {
    const { taskId, page = 1, limit = 10 } = req.query;

    if (!taskId) {
      return res.status(400).json({ error: "Please provide a taskId in query" });
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const data = await SubtaskController.getSubtasksPaginated(taskId, pageNum, limitNum);
    // data => { rows, total }
    res.json(data); // e.g. { rows: [...], total: 50 }
  } catch (error) {
    console.error("Error fetching paginated subtasks:", error);
    res.status(500).json({ error: 'Failed to fetch subtasks' });
  }
});

// CREATE a new subtask
router.post('/', async (req, res) => {
  try {
    const { taskId, title, content, completed } = req.body;

    const newSubtask = await SubtaskController.createSubtask({
      taskId,
      title,
      content,
      completed
    });
    res.status(201).json(newSubtask);
  } catch (error) {
    console.error("Error creating subtask:", error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE subtask
router.put('/:id', async (req, res) => {
  try {
    const updatedSubtask = await SubtaskController.updateSubtask(req.params.id, req.body);
    res.json(updatedSubtask);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update subtask' });
  }
});

// DELETE subtask
router.delete('/:id', async (req, res) => {
  try {
    await SubtaskController.deleteSubtask(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete subtask' });
  }
});

module.exports = router;