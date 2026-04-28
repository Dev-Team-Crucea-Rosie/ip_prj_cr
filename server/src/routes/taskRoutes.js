const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { createTask, getTasksByVolunteerId, getAllTasks, getTasksByEventId } = require('../models/taskModel');

const router = express.Router();

router.get('/event/:eventId', authMiddleware, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const tasks = await getTasksByEventId(eventId);
    return res.json({ tasks });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await getAllTasks();
    return res.json({ tasks });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
});

router.get('/my-tasks', authMiddleware, async (req, res) => {
  try {
    const volunteerId = req.user.id;
    const tasks = await getTasksByVolunteerId(volunteerId);
    return res.json({ tasks });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { volunteerId, eventId, description, status = 'pending' } = req.body;
  if (!volunteerId || !eventId || !description) {
    return res.status(400).json({ message: 'volunteerId, eventId, description are required' });
  }
  try {
    const task = await createTask({ volunteerId, eventId, description, status });
    return res.status(201).json({ task });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
});


router.put('/:id', authMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  const { description, status } = req.body;
  if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid id' });
  try {
    const { rows } = await require('../config/db').query(
      `UPDATE tasks SET description = COALESCE($1, description), status = COALESCE($2, status) WHERE id = $3 RETURNING *`,
      [description, status, id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Task not found' });
    return res.json({ task: rows[0] });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
});
module.exports = router;
