const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const StringModel = sequelize.define('StringRecord', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  fecha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  hora: {
    type: DataTypes.STRING,
    allowNull: false
  },
  string: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  user: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'strings',
  timestamps: false
});

module.exports = StringModel;
