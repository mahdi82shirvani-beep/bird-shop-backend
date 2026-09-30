const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('./user.model'); // آدرس مدل یوزر را چک کن

const SellerInfo = sequelize.define('SellerInfo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  nationalCode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, 
  }
});


User.hasOne(SellerInfo, { foreignKey: 'userId', as: 'sellerDetails', onDelete: 'CASCADE' });
SellerInfo.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = SellerInfo;