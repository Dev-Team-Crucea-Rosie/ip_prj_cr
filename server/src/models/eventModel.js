const db = require('../config/db');

async function createEvent({ projectId, name, date, location, qrCode }) {
  const query = `
    INSERT INTO events (project_id, name, date, location, qr_code)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [projectId, name, date, location, qrCode || null];
  const { rows } = await db.query(query, values);
  return rows[0];
}

async function getAllEvents() {
  const query = `SELECT * FROM events;`;
  const { rows } = await db.query(query);
  return rows;
}

async function getEventsByProjectId(projectId) {
  const query = `SELECT * FROM events WHERE project_id = $1;`;
  const { rows } = await db.query(query, [projectId]);
  return rows;
}

module.exports = {
  createEvent,
  getAllEvents,
  getEventsByProjectId
};