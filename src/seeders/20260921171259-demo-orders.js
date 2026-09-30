'use strict';
const { fakerFA } = require('@faker-js/faker');

module.exports = {
  async up (queryInterface, Sequelize) {
    const orders = [];
    
    // حلقه برای ساخت ۵۰ آگهی تصادفی
    for (let i = 0; i < 50; i++) {
      const saleType = fakerFA.helpers.arrayElement(['single', 'wholesale']);
      
      orders.push({
        categoryId: fakerFA.helpers.arrayElement(['parrot', 'cockatiel', 'canary', 'finch']),
        saleType: saleType,
        title: `فروش پرنده ${fakerFA.commerce.productAdjective()}`,
        price: fakerFA.commerce.price({ min: 500000, max: 20000000, dec: 0 }).toString(),
        age: fakerFA.number.int({ min: 1, max: 10 }).toString() + ' ساله',
        gender: fakerFA.helpers.arrayElement(['male', 'female', 'unknown']),
        description: fakerFA.lorem.paragraph(),
        ringNumber: saleType === 'single' ? fakerFA.string.alphanumeric(8).toUpperCase() : null,
        quantity: saleType === 'wholesale' ? fakerFA.number.int({ min: 10, max: 200 }) : null,
        province: fakerFA.location.state(),
        phone: fakerFA.phone.number('09#########'),
        contactMethod: fakerFA.helpers.arrayElement(['phone', 'chat', 'both']),
        healthCertificate: 'uploads/dummy-health-cert.jpg',
        images: JSON.stringify(['uploads/bird1.jpg', 'uploads/bird2.jpg']),
        status: fakerFA.helpers.arrayElement(['pending', 'approved', 'rejected']),
        sellerId: 2, // این آگهی‌ها به کاربری که آیدی 2 دارد (فروشنده تستی) متصل می‌شوند
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // تزریق یک‌باره هر ۵۰ رکورد به جدول Orders
    await queryInterface.bulkInsert('Orders', orders, {});
  },

  async down (queryInterface, Sequelize) {
    // در صورت نیاز به بازگشت (Undo)، تمام دیتاهای این جدول پاک می‌شوند
    await queryInterface.bulkDelete('Orders', null, {});
  }
};