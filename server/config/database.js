const { Sequelize } = require('sequelize');
require('dotenv').config();

// Validamos variables críticas antes de crear la conexión
if (!process.env.DB_PASSWORD) {
  throw new Error('DB_PASSWORD no está definida en las variables de entorno');
}

if (!process.env.DB_HOST) {
  throw new Error('DB_HOST no está definida en las variables de entorno');
}

if (!process.env.DB_USER) {
  throw new Error('DB_USER no está definida en las variables de entorno');
}

if (!process.env.DB_NAME) {
  throw new Error('DB_NAME no está definida en las variables de entorno');
}

// Creamos la instancia de Sequelize para TiDB Cloud.
// TiDB es compatible con MySQL, por eso el dialect sigue siendo "mysql".
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 4000),
    dialect: 'mysql',

    // En producción es mejor dejar el logging desactivado
    logging: false,

    dialectOptions: {
      // TiDB Cloud Serverless exige conexión segura mediante TLS
      ssl:
        process.env.TIDB_ENABLE_SSL === 'true'
          ? {
              minVersion: 'TLSv1.2',
              rejectUnauthorized: true,
            }
          : undefined,
    },
  }
);

module.exports = sequelize;