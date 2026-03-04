const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

const Favorite = sequelize.define("Favorite", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  itemType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  itemId: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: "favorites",
  timestamps: true,
  indexes: [
    { unique: true, fields: ["userId", "itemType", "itemId"] }
  ]
});

module.exports = Favorite;
