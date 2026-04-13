const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  presupuesto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  region: {
    type: DataTypes.STRING,
    allowNull: false
  },
  provincia: {
    type: DataTypes.STRING,
    allowNull: false
  },
  comuna: {
    type: DataTypes.STRING,
    allowNull: false
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('activo', 'en_proceso', 'completado', 'cancelado'),
    defaultValue: 'activo'
  },
  urgencia: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fecha_preferida: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fecha_expiracion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  categoryId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  subcategoryId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: { model: 'subcategories', key: 'id' }
  },
  expertId: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    references: { model: 'user', key: 'id' }
  },
  calificacion: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: true
  },
  resena: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'jobs',
  timestamps: true
});

module.exports = Job;
