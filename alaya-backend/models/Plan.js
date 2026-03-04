const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

const Plan = sequelize.define("Plan", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  date: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  yogaType: { 
    type: DataTypes.STRING, 
    allowNull: true 
  }, 
  duration: { 
    type: DataTypes.INTEGER, 
    defaultValue: 30 
  },
  notes: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },

  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "planned" 
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, { 
  tableName: "plans", 
  timestamps: true 
});

module.exports = Plan;