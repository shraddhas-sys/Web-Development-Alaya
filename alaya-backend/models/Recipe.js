const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

const Recipe = sequelize.define("Recipe", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: true, 
    field: 'userid' 
  },
  
  name: { type: DataTypes.STRING, allowNull: false },
  
  ingredients: { 
    type: DataTypes.JSON, 
    allowNull: true 
  },
  
  calories: { 
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  instructions: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },

  isFavorite: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false,
    field: 'isfavorite' 
  },

 // to check admin made or user
  isAdminRecipe: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, { 
  tableName: "recipes", 
  timestamps: true, 
  underscored: true
});

module.exports = Recipe;