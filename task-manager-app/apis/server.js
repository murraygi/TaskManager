const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const taskRoutes = require('./rest/tasks');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors()); // Allows all origins for development

// Middleware to parse JSON
app.use(express.json());

// Function to sync database
async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true }); // Keep data, update structure
    console.log("Database synced (Tables updated, no data loss)");
  } catch (err) {
    console.error("PostgreSQL connection error:", err);
  }
}

// Call the function before starting the server
syncDatabase().then(() => {
  const PORT = process.env.PORT || 5050;
  app.use("/api/tasks", taskRoutes);

  app.listen(PORT, () => {
    console.log(`REST API running on http://localhost:${PORT}`);
  });
});