const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db'); 

const YogaType = sequelize.define('YogaType', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, 
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  durationDefault: {
    type: DataTypes.INTEGER,
    defaultValue: 30, 
  }
}, {
  timestamps: true,
});

module.exports = YogaType;