const express = require('express');
const sequelize = require('./config/database');
const taskRoutes = require('./routes/tasks');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware to parse JSON
app.use(express.json());

// Connect to PostgreSQL
sequelize
  .sync({ force: true }) // Drops and recreates tables (dev only)
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('PostgreSQL connection error:', err));

// Mount routes
app.use('/api/tasks', taskRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 REST Server running on http://localhost:${PORT}`);
});