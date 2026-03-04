const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

const MealPlan = sequelize.define("MealPlan", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: 'users', 
      key: 'id'
    }
  },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  // meal id list
  morningMealId: { type: DataTypes.INTEGER, allowNull: true },
  afternoonMealId: { type: DataTypes.INTEGER, allowNull: true },
  eveningMealId: { type: DataTypes.INTEGER, allowNull: true },

  breakfast: { type: DataTypes.STRING },
  lunch: { type: DataTypes.STRING },
  dinner: { type: DataTypes.STRING },
  
  notes: { type: DataTypes.TEXT }
}, { 
  tableName: "meal_plans",
  timestamps: true 
});

module.exports = MealPlan;