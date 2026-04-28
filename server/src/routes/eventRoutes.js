const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { createEvent, getAllEvents, getEventsByProjectId } = require('../models/eventModel');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const events = await getAllEvents();
    return res.json({ events });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
});

router.get('/project/:projectId', authMiddleware, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const events = await getEventsByProjectId(projectId);
    return res.json({ events });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { projectId, name, date, location, qrCode } = req.body;
  if (!projectId || !name || !date || !location) {
    return res.status(400).json({ message: 'projectId, name, date, location are required' });
  }
  try {
    const event = await createEvent({ projectId, name, date, location, qrCode });
    return res.status(201).json({ event });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create event', error: error.message });
  }
});

module.exports = router;