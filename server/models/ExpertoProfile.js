const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ExpertoProfile = sequelize.define('ExpertoProfile', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombres: { type: DataTypes.STRING, allowNull: false },
  apellidos: { type: DataTypes.STRING, allowNull: false },
  telefono: DataTypes.STRING,
  direccion: DataTypes.TEXT,
  region: DataTypes.STRING,
  provincia: DataTypes.STRING,
  comuna: DataTypes.STRING,
  bio: DataTypes.TEXT,
  avatar_url: DataTypes.STRING,
  userId: { type: DataTypes.UUID, allowNull: true },
  verificationStatus: {
    type: DataTypes.ENUM('pendiente', 'activo', 'anulado'),
    allowNull: false,
    defaultValue: 'pendiente',
  }
}, {
  tableName: 'experto_profile',
  timestamps: true
});

module.exports = ExpertoProfile;
