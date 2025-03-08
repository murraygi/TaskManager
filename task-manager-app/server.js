const express = require('express');
const compression = require('compression');
const path = require('path');
const cors = require('cors');
const sequelize = require('./apis/config/database');
const taskRoutes = require('./apis/rest/routes/tasks');
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
    await sequelize.sync({ alter: true }); // Keep data, update structure
    console.log("Database synced (Tables updated, no data loss)");
  } catch (err) {
    console.error("PostgreSQL connection error:", err);
  }
}

// Call the function before starting the server
syncDatabase().then(() => {
  //REST API setup
  app.use("/api/tasks", taskRoutes);

  // GraphQL API setup
  const yoga = createYoga({ schema });
  app.use(yoga.graphqlEndpoint, yoga); // GraphQL route                                                   

  const PORT = process.env.PORT || 5050;
  app.listen(PORT, () => {
    console.log(`🚀 REST API running at http://localhost:${PORT}/api/tasks`);
    console.log(`GraphQL API running on http://localhost:${PORT}/graphql`);
  });
});