const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT, // PostgreSQL uses TEXT for long content
    allowNull: false,
  },
  priority: {
    type: DataTypes.STRING,
    defaultValue: 'Low',
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
});

module.exports = Task;