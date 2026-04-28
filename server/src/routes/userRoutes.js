const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../config/db');
const { toPerson } = require('../schemas/resources');

const router = express.Router();

router.get('/volunteers', authMiddleware, async (req, res) => {
  try {
    const query = `SELECT * FROM users WHERE is_coordinator = false AND is_administrator = false;`;
    const { rows } = await db.query(query);
    return res.json({ volunteers: rows.map(toPerson) });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch volunteers', error: error.message });
  }
});

module.exports = router;