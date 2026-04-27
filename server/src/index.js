const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { checkDatabaseConnection } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: "Hello from the JS Backend!" });
});

app.get('/health', async (req, res) => {
  try {
    await checkDatabaseConnection();
    res.json({
      status: 'ok',
      server: 'running',
      database: 'connected',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      server: 'running',
      database: 'disconnected',
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
