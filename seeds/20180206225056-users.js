'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users',  //Notice the plural here
    [
      {
        email: 'test@gmail.com',
        name: 'Bob Test',
        password: 'password',
        zip: '92123',
        createdAt: new Date(), // we need to add the manually for seeds
        updatedAt: new Date(),
        authToken: 0,
        authTokenExpiration: new Date(),
        salt: ""
      },
      {
        email: 'sally@aol.com',
        name: 'Sally Bobby',
        password: 'sally',
        zip: '92123',
        createdAt: new Date(), // we need to add the manually for seeds
        updatedAt: new Date(),
        authToken: 0,
        authTokenExpiration: new Date(),
        salt: ""
      }
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
};
