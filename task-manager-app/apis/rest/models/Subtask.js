const { DataTypes } = require("sequelize");
const sequelize = require('../../config/database'); // Import Sequelize instance
const Task = require("./Task"); // Import Task model

const Subtask = sequelize.define("Subtask", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  taskId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "tasks", // Table name in DB
      key: "id",
    },
    onDelete: "CASCADE",
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  tableName: 'subtasks',
});

// Define the relationship (A Task has many Subtasks)
Task.hasMany(Subtask, { foreignKey: "taskId", as: "subtasks" });
Subtask.belongsTo(Task, { foreignKey: "taskId", as: "task" });

module.exports = Subtask;