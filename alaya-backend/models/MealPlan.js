const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

const MealPlan = sequelize.define("MealPlan", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  breakfast: { type: DataTypes.STRING },
  lunch: { type: DataTypes.STRING },
  dinner: { type: DataTypes.STRING },
  notes: { type: DataTypes.TEXT }
}, { tableName: "meal_plans" });

module.exports = MealPlan;