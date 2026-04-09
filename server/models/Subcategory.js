const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Subcategory = sequelize.define('Subcategory', {
  id: { 
    type: DataTypes.INTEGER.UNSIGNED, 
    primaryKey: true, 
    autoIncrement: true 
  },
  category_id: { 
    type: DataTypes.INTEGER.UNSIGNED, 
    allowNull: false 
  },
  name: { 
    type: DataTypes.STRING(150), 
    allowNull: false 
  },
  slug: { 
    type: DataTypes.STRING(180), 
    allowNull: false 
  },
  description: { 
    type: DataTypes.STRING(255), 
    allowNull: true 
  },
  keywords: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Palabras clave separadas por coma para búsqueda inteligente'
  },
  is_active: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, {
  tableName: 'subcategories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { unique: true, fields: ['category_id', 'name'] },
    { unique: true, fields: ['category_id', 'slug'] }
  ]
});

module.exports = Subcategory;
