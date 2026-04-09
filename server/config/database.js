const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'experthands_db',
  process.env.DB_USER || 'manuel',
  process.env.DB_PASSWORD || 'q1w2e3',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, // Desactiva los logs SQL en la consola (como pediste)
  }
);

module.exports = sequelize;
