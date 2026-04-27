const { Pool } = require('pg');

let pool = null;

const getPool = () => {
  if (pool) {
    return pool;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  return pool;
};

const query = (text, params = []) => getPool().query(text, params);

const checkDatabaseConnection = async () => {
  await query('SELECT 1');
};

module.exports = {
  getPool,
  query,
  checkDatabaseConnection,
};
