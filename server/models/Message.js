const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  senderId: { type: DataTypes.CHAR(36), allowNull: false },
  receiverId: { type: DataTypes.CHAR(36), allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  is_read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
  tableName: 'messages',
  timestamps: true,
});

module.exports = Message;
