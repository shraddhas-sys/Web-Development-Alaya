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
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
    allowNull: false
  },

// Account status
  isDisabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  loginCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  failedLoginCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
// settings column
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "+977 "
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  profilepic: {
    type: DataTypes.STRING,
    allowNull: true
  },

 // security password
  securityPasswordHash: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // forgot password
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastSeen: {
    type: DataTypes.DATE,
    allowNull: true
  }

}, {
  tableName: "users",
  timestamps: true
});

module.exports = User;
