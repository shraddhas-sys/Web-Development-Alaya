const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD || process.env.DB_PASS, 
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database Connected Successfully');
  } catch (error) {
    console.error(' Database Connection Failed:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };