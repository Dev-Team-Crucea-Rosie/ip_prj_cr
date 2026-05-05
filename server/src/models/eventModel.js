const db = require("../config/db");

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

async function generateEventQr(eventId) {
  const crypto = require("crypto");
  const qrCode = crypto.randomUUID();
  const query = `
    UPDATE events
    SET qr_code = $1
    WHERE id = $2
    RETURNING *;
  `;
  const { rows } = await db.query(query, [qrCode, eventId]);
  return rows[0];
}

async function getEventAttendance(eventId) {
  const query = `
    SELECT u.id, u.first_name, u.last_name, u.email, a.scan_date, a.scan_time
    FROM attendance a
    JOIN users u ON a.volunteer_id = u.id
    WHERE a.event_id = $1;
  `;
  const { rows } = await db.query(query, [eventId]);
  return rows;
}

async function recordAttendance({ userId, qrCode }) {
  // First, find the event by qrCode
  const eventQuery = `SELECT id FROM events WHERE qr_code = $1;`;
  const eventResult = await db.query(eventQuery, [qrCode]);

  if (eventResult.rows.length === 0) {
    throw new Error("QR Invalid");
  }

  const eventId = eventResult.rows[0].id;

  // Check if attendance already exists
  const checkQuery = `SELECT id FROM attendance WHERE volunteer_id = $1 AND event_id = $2;`;
  const checkResult = await db.query(checkQuery, [userId, eventId]);

  if (checkResult.rows.length > 0) {
    throw new Error("Ai scanat deja acest cod.");
  }

  const currentDate = new Date().toISOString().split("T")[0];
  const currentTime = new Date().toLocaleTimeString("en-US", { hour12: false });

  const insertQuery = `
    INSERT INTO attendance (volunteer_id, event_id, scan_date, scan_time)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const { rows } = await db.query(insertQuery, [
    userId,
    eventId,
    currentDate,
    currentTime,
  ]);
  return rows[0];
}

module.exports = {
  createEvent,
  getAllEvents,
  getEventsByProjectId,
  generateEventQr,
  getEventAttendance,
  recordAttendance,
};
