const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true, // Ensure it is treated as the primary key
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  priority: {
    type: DataTypes.STRING,
    defaultValue: 'Low',
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  tableName: 'tasks',
});

module.exports = Task;
