'use strict'
var SequelizeMock = require('sequelize-mock')
var dbMock = new SequelizeMock()

module.exports = function(sequelize, DataTypes){
  return dbMock.define('User', {
    email: 'test@gmail.com',
    name: 'Bob Test',
    password: 'password',
    zip: '92123',
	authToken:'0760fa20-1344-11e8-a7c4-a7ee3932edc1',
  })
}
