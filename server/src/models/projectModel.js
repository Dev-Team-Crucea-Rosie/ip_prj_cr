const { query } = require('../config/db');

const createProject = async ({ name, description }) => {
  const result = await query(
    `INSERT INTO projects (name, description)
     VALUES ($1, $2)
     RETURNING id, name, description`,
    [name, description]
  );

  return result.rows[0];
};

const getAllProjects = async () => {
  const result = await query(
    `SELECT id, name, description
     FROM projects
     ORDER BY id ASC`
  );

  return result.rows;
};

const getProjectById = async (id) => {
  const result = await query(
    `SELECT id, name, description
     FROM projects
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
};

const updateProjectById = async (id, { name, description }) => {
  const result = await query(
    `UPDATE projects
     SET name = $1, description = $2
     WHERE id = $3
     RETURNING id, name, description`,
    [name, description, id]
  );

  return result.rows[0] || null;
};

const deleteProjectById = async (id) => {
  const result = await query(
    `DELETE FROM projects
     WHERE id = $1
     RETURNING id, name, description`,
    [id]
  );

  return result.rows[0] || null;
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProjectById,
  deleteProjectById,
};
