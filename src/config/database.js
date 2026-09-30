const { Sequelize } = require('sequelize');
const path = require('path');


// تنظیمات دیتابیس SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  // دیتابیس را در پوشه اصلی پروژه با نام database.sqlite می‌سازد
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: false, // برای جلوگیری از شلوغ شدن کنسول با لاگ‌های SQL
});

module.exports = sequelize;