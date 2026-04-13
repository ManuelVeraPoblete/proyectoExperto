const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PortfolioReview = sequelize.define('PortfolioReview', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  portfolioItemId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.CHAR(36), allowNull: false },
  comment: { type: DataTypes.TEXT, allowNull: false },
  rating: { type: DataTypes.DECIMAL(2, 1), allowNull: false },
}, {
  tableName: 'portfolio_reviews',
  timestamps: true,
});

module.exports = PortfolioReview;
