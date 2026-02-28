const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

const Pantry = sequelize.define("Pantry", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false }
}, { tableName: "pantry" });

module.exports = Pantry;