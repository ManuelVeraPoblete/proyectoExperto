const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombres: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellidos: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefono: DataTypes.STRING,
  direccion: DataTypes.TEXT,
  region: DataTypes.STRING,
  provincia: DataTypes.STRING,
  comuna: DataTypes.STRING,
  bio: DataTypes.TEXT,
  avatar_url: DataTypes.STRING
}, {
  tableName: 'userprofile',
  timestamps: true
});

module.exports = Profile;
