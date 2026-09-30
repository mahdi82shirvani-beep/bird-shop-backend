const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, 
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'buyer',
    validate: {
      isIn: [['admin', 'seller', 'buyer']],
    },
  },

  fullName: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = User;