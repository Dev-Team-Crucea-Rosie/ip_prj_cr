const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    })
  : null;

const checkDatabaseConnection = async () => {
  if (!pool) {
    throw new Error('DATABASE_URL is not set');
  }

  await pool.query('SELECT 1');
};

module.exports = {
  checkDatabaseConnection,
};
