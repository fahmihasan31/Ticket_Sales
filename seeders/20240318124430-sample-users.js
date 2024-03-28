'use strict';
let md5 = require('md5')
const now = new Date()

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        firstname: 'user1',
        lastname: 'bambang',
        email: 'adbam@gmail.com',
        password: md5('12345'),
        role: 'admin',
        createdAt: now,
        updatedAt: now
      },
      {
        firstname: 'user2',
        lastname: 'taylor',
        email: 'tayer@gmail.com',
        password: md5('6789'),
        role: 'user',
        createdAt: now,
        updatedAt: now
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {})

  }
};
