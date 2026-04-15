const { Sequelize } = require('sequelize');
require('dotenv').config();

if (!process.env.DB_PASSWORD) {
  throw new Error('DB_PASSWORD no está definida en las variables de entorno');
}

const sequelize = new Sequelize(
  process.env.DB_NAME || 'experthands_db',
  process.env.DB_USER || 'manuel',
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

module.exports = sequelize;
