const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PortfolioItem = sequelize.define('PortfolioItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  expertoId: { type: DataTypes.UUID, allowNull: false },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  category: { type: DataTypes.STRING(100), allowNull: true },
  image_url: { type: DataTypes.TEXT, allowNull: true }, // JSON array de rutas, ej: ["/uploads/experto/file.jpg"]
  date: { type: DataTypes.DATEONLY, allowNull: true },
}, {
  tableName: 'portfolio_items',
  timestamps: true,
});

module.exports = PortfolioItem;
