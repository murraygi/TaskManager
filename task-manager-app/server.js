const express = require('express');
const compression = require('compression');
const path = require('path');
const cors = require('cors');
const sequelize = require('./apis/config/database');
const Task = require('./apis/rest/models/Task');
const Subtask = require('./apis/rest/models/Subtask');
const taskRoutes = require('./apis/rest/routes/tasks');
const subtaskRoutes = require('./apis/rest/routes/subtasks');
const { createYoga } = require('graphql-yoga');
const schema = require('./apis/graphql');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Apply compression middleware before serving static files
app.use(compression()); 

// Serve static files from the build folder
app.use(express.static(path.join(__dirname, 'dist')));

// Function to sync database
async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL successfully.");
    await Task.sync({ alter: true }); // Ensure Tasks table is created first
    await Subtask.sync({ alter: true }); // Then sync Subtasks
    console.log("Database synced (Tables updated, no data loss)");
  } catch (err) {
    console.error("PostgreSQL connection error:", err);
  }
}

// Call the function before starting the server
syncDatabase().then(() => {
  //REST API setup
  app.use("/api/tasks", taskRoutes);
  app.use("/api/subtasks", subtaskRoutes);

  // GraphQL API setup
  const yoga = createYoga({ schema });
  app.use(yoga.graphqlEndpoint, yoga); // GraphQL route                                                   

  const PORT = process.env.PORT || 5050;
  app.listen(PORT, () => {
    console.log(`🚀 REST API running at http://localhost:${PORT}/api/tasks`);
    console.log(`GraphQL API running on http://localhost:${PORT}/graphql`);
  });
});