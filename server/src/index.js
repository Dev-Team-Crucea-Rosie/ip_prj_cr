const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { checkDatabaseConnection } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const eventRoutes = require('./routes/eventRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const { resourceSchemas } = require('./schemas/resources');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/events', eventRoutes);
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);

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

app.get('/schemas', (req, res) => {
  res.json(resourceSchemas);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
