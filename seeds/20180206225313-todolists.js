'use strict';

let User = require('../models').User

module.exports = {
  up: (queryInterface, Sequelize) => {
    return User.findAll().then(function(lists){ // returns a promise
      let todoListPromises = lists.map(function(list){
        return queryInterface.bulkInsert('TodoLists',
        [
          {
            title: 'Test',
            type: "Party",
            isComplete: false,
            userId: list.get('id'),
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            title: 'Test 2',
            type: "Work",
            isComplete: false,
            userId: list.get('id'),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ])
      })
      return Promise.all(todoListPromises)
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('TodoLists', null, {})
  }
};
