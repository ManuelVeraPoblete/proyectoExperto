const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JobPhoto = sequelize.define('JobPhoto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  photo_url: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'job_photos',
  timestamps: true
});

module.exports = JobPhoto;
