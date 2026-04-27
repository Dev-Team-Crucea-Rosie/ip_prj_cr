const { query } = require('../config/db');

const createUser = async ({
  firstName,
  lastName,
  email,
  phone,
  password,
  isCoordinator = false,
  isAdministrator = false,
}) => {
  const result = await query(
    `INSERT INTO users (first_name, last_name, email, phone, password, is_coordinator, is_administrator)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, first_name, last_name, email, phone, password, is_coordinator, is_administrator`,
    [firstName, lastName, email, phone || null, password, isCoordinator, isAdministrator]
  );

  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await query(
    `SELECT id, first_name, last_name, email, phone, password, is_coordinator, is_administrator
     FROM users
     WHERE email = $1`,
    [email]
  );

  return result.rows[0] || null;
};

module.exports = {
  createUser,
  findUserByEmail,
};
