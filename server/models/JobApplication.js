const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JobApplication = sequelize.define('JobApplication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  presupuesto_ofrecido: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'aceptado', 'rechazado'),
    defaultValue: 'pendiente'
  }
}, {
  tableName: 'job_applications',
  timestamps: true
});

module.exports = JobApplication;
