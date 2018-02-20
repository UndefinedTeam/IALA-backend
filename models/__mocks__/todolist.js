'use strict'
var SequelizeMock = require('sequelize-mock')
var dbMock = new SequelizeMock()

module.exports = function(sequelize, DataTypes){
  return dbMock.define('TodoList', {
    title: 'Test List',
    categoryID: 0,
    isComplete: false,
    userId: 0,
  })
}
