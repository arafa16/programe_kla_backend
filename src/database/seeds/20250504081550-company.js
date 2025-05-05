'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('companies',[
      {
        id:1,
        uuid:'1c09ee81-0c75-4728-bbba-1b91fb0c571e',
        name: 'company',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('companies');
  }
};
