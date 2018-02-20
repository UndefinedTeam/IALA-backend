'use strict';

let TodoList = require('../models').TodoList

module.exports = {
  up: (queryInterface, Sequelize) => {
    return TodoList.findAll().then(function(tasks){ // returns a promise
      let taskPromises = tasks.map(function(task){
        return queryInterface.bulkInsert('Tasks',
          [
            {
              task: 'Task 1',
              desc: 'Test this thing',
              isComplete: false,
              type: "Party",
              dateStart: 'today',
              dateDone : 'tommorow',
              listId: task.get('id'),
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              task: 'Task 2',
              desc: 'Test this thing again',
              isComplete: false,
              type: "Work",
              dateStart: 'today',
              dateDone : 'tommorow',
              listId: task.get('id'),
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ])
        })
        return Promise.all(taskPromises)
      })
    },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tasks', null, {})
  }
};
