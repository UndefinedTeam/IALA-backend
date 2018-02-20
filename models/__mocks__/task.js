'use strict'
var SequelizeMock = require('sequelize-mock')
var dbMock = new SequelizeMock()

module.exports = function(sequelize, DataTypes){
  return dbMock.define('Task', {
    task: 'Task 1',
    desc: 'Test this thing',
    isComplete: false,
    categoryId: 0,
    dateStart: 'today',
    dateDone : 'tommorow',
    todoListId: 1,
    priority: 'low',
  })
}
