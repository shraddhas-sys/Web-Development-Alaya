const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');
const User = require('./user'); 

const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: 'users', 
      key: 'id'
    }
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
  ,

  // progress part
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'planned' 
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },

  //completed yoga plan results
  sourcePlanId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'Sessions', 
  timestamps: true, 
});

module.exports = Session;