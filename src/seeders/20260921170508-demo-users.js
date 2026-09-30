'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      { phone: '09120000001', role: 'admin', fullName: 'ادمین اصلی', createdAt: new Date(), updatedAt: new Date() },
      { phone: '09120000002', role: 'seller', fullName: 'فروشنده پرنده ۱', createdAt: new Date(), updatedAt: new Date() },
      { phone: '09120000003', role: 'buyer', fullName: 'خریدار تستی', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};