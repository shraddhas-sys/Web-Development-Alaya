const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  type: { 
    type: DataTypes.STRING,
    allowNull: false, 
  },
  durationMinutes: { 
    type: DataTypes.INTEGER,
    defaultValue: 30,
  }
}, {
  timestamps: true, 
});

module.exports = Session;