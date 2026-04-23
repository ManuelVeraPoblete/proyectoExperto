require('dotenv').config();

const sslOptions = process.env.TIDB_ENABLE_SSL === 'true'
  ? { dialectOptions: { ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true } } }
  : {};

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || 'experthands_db',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 4000),
    dialect: 'mysql',
    logging: false,
    ...sslOptions,
  },
  test: {
    username: process.env.DB_USER_TEST || process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD_TEST || process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME_TEST || 'experthands_test',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
  },
};
