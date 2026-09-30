const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('../users/user.model');

const Order = sequelize.define('Order', {
  categoryId: { type: DataTypes.STRING, allowNull: false },
  saleType: { type: DataTypes.ENUM('single', 'wholesale'), allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.NUMBER, allowNull: false },
  age: { type: DataTypes.STRING, allowNull: true },
  gender: { type: DataTypes.ENUM('male', 'female', 'unknown'), defaultValue: 'unknown' },
  description: { type: DataTypes.TEXT, allowNull: true },
  ringNumber: { type: DataTypes.STRING, allowNull: true },
  quantity: { type: DataTypes.INTEGER, allowNull: true },
  province: { type: DataTypes.STRING, allowNull: false },// استان
  phone: { type: DataTypes.STRING, allowNull: false },
  contactMethod: { type: DataTypes.ENUM('phone', 'chat', 'both'), defaultValue: 'both' },
  healthCertificate: { type: DataTypes.STRING, allowNull: false },
  heathStatus: {type: DataTypes.ENUM('positive', 'negative', 'unknown'), defaultValue: 'unknown'}, //وضعیت تایید ادمین برای درستی گواهی سلامت
  images: { type: DataTypes.TEXT, allowNull: true },  
  status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' } //  وضعیت تایید ادمین برای کل اگهی
});


Order.belongsTo(User, { as: 'seller', foreignKey: 'sellerId' });
User.hasMany(Order, { foreignKey: 'sellerId' });

module.exports = Order;