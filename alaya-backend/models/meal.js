const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db"); 

const Meal = sequelize.define("Meal", {
  name: { type: DataTypes.STRING, allowNull: false },
  kcal: { type: DataTypes.INTEGER },
  category: { type: DataTypes.STRING }, 
  timeSlot: { 
    type: DataTypes.ENUM("Morning", "Afternoon", "Evening"), 
    allowNull: false 
  },
  ingredients: { type: DataTypes.TEXT },
  image: { type: DataTypes.STRING }
}, { tableName: "meals" });

module.exports = Meal;