const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Report = sequelize.define('Report', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: {
    type: DataTypes.ENUM('review', 'user', 'post', 'language'),
    allowNull: false,
  },
  reason: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  reporterId: { type: DataTypes.CHAR(36), allowNull: true },
  reportedUserId: { type: DataTypes.CHAR(36), allowNull: true },
  reportedContent: { type: DataTypes.TEXT, allowNull: true },
  status: {
    type: DataTypes.ENUM('pending', 'reviewed', 'resolved'),
    allowNull: false,
    defaultValue: 'pending',
  },
}, {
  tableName: 'reports',
  timestamps: true,
});

module.exports = Report;
