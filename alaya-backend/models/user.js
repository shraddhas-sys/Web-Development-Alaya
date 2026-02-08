const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

const User = sequelize.define("User", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  username: { 
    type: DataTypes.STRING, 
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true,
    validate: {
      isEmail: true // इमेलको फर्म्याट चेक गर्छ
    }
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
}, { 
  tableName: "users", 
  timestamps: true 
});

module.exports = User;