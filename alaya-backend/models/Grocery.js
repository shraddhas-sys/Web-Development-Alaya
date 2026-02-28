const { DataTypes } = require("sequelize"); 
const { sequelize } = require("../database/db"); 

const Grocery = sequelize.define("Grocery", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  checked: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: "grocery" });

module.exports = Grocery;