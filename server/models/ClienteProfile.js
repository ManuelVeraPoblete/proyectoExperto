const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ClienteProfile = sequelize.define('ClienteProfile', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombres: { type: DataTypes.STRING, allowNull: false },
  apellidos: { type: DataTypes.STRING, allowNull: false },
  telefono: DataTypes.STRING,
  direccion: DataTypes.TEXT,
  region: DataTypes.STRING,
  provincia: DataTypes.STRING,
  comuna: DataTypes.STRING,
  avatar_url: DataTypes.STRING,
  userId: { type: DataTypes.STRING(36), allowNull: true }
}, {
  tableName: 'cliente_profile',
  timestamps: true
});

module.exports = ClienteProfile;
