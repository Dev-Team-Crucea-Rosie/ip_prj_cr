const db = require("../config/db");

async function createTask({ volunteerId, eventId, description, status }) {
  const query = `
    INSERT INTO tasks (volunteer_id, event_id, description, status)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [volunteerId, eventId, description, status];
  const { rows } = await db.query(query, values);
  return rows[0];
}

async function getTasksByVolunteerId(volunteerId) {
  const query = `
    SELECT t.*, e.name as event_name, e.date as event_date, e.location as event_location,
           p.id as project_id, p.name as project_name,
           EXISTS (
             SELECT 1 FROM attendance a 
             WHERE a.event_id = t.event_id AND a.volunteer_id = t.volunteer_id
           ) as is_present
    FROM tasks t
    JOIN events e ON t.event_id = e.id
    JOIN projects p ON e.project_id = p.id
    WHERE t.volunteer_id = $1;
  `;
  const { rows } = await db.query(query, [volunteerId]);
  return rows;
}

async function getAllTasks() {
  const query = `
    SELECT t.*, e.name as event_name, u.first_name as volunteer_first_name, u.last_name as volunteer_last_name
    FROM tasks t
    JOIN events e ON t.event_id = e.id
    JOIN users u ON t.volunteer_id = u.id;
  `;
  const { rows } = await db.query(query);
  return rows;
}

async function getTasksByEventId(eventId) {
  const query = `
    SELECT t.*, u.first_name as volunteer_first_name, u.last_name as volunteer_last_name, u.email as volunteer_email
    FROM tasks t
    JOIN users u ON t.volunteer_id = u.id
    WHERE t.event_id = $1;
  `;
  const { rows } = await db.query(query, [eventId]);
  return rows;
}

module.exports = {
  createTask,
  getTasksByVolunteerId,
  getAllTasks,
  getTasksByEventId,
};
