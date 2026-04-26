const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PortfolioReaction = sequelize.define('PortfolioReaction', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  portfolioItemId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.UUID, allowNull: false },
  reaction: {
    type: DataTypes.ENUM('heart', 'like', 'clap', 'dislike'),
    allowNull: false,
  },
}, {
  tableName: 'portfolio_reactions',
  timestamps: true,
});

module.exports = PortfolioReaction;
