const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: { 
    type: DataTypes.INTEGER.UNSIGNED, 
    primaryKey: true, 
    autoIncrement: true 
  },
  name: { 
    type: DataTypes.STRING(120), 
    allowNull: false, 
    unique: true 
  },
  slug: { 
    type: DataTypes.STRING(140), 
    allowNull: false, 
    unique: true 
  },
  description: { 
    type: DataTypes.STRING(255), 
    allowNull: true 
  },
  is_active: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, {
  tableName: 'categories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Category;
