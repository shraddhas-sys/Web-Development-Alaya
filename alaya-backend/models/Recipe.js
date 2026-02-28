const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

const Recipe = sequelize.define("Recipe", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    field: 'userid' 
  },
  name: { type: DataTypes.STRING, allowNull: false },
  isFavorite: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false,
    field: 'isfavorite' 
  }
}, { 
  tableName: "recipes", 
  timestamps: true, 
  underscored: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = Recipe;