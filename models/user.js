'use strict';
const crypto = require('crypto')
const uuid = require('uuid/v1')

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    zip: DataTypes.STRING,
    authToken: DataTypes.STRING,
    authTokenExpiration: DataTypes.DATE,
    salt: DataTypes.STRING
  },  {
    setterMethods: {
      password(value){
        if(value){
          const salt = uuid()
          this.setDataValue('salt', salt)
          const hash = this.encrypt(value)
          this.setDataValue('password', hash)
      }
    }
  },

    classMethods: {
      associate: function(models) {
        User.hasMany(models.TodoList,{
          foreignKey: 'userId',
          as: 'todolists'
        })
      }
    },

    instanceMethods:{
      toJSON(){
        return {
          id: this.get('id'),
          name: this.get('name'),
          email: this.get('email'),
          authToken: this.get('authToken'),
          authTokenExpiration: this.get('authTokenExpiration')
        }
      },
      encrypt(value){
        const salt = this.get('salt')
        return crypto.createHmac('sha512', salt)
        .update(value)
        .digest('hex')
      },
      // An instance method to update the user's token
      // This is called when we create a user, and can be reset
      // from routes when the user logs in.
      setAuthToken(){
        const token = uuid()
        const expiration = new Date()
        expiration.setMonth(expiration.getMonth() + 1)
        this.setDataValue('authToken', token)
        this.setDataValue('authTokenExpiration', expiration)
      },
      verifyPassword(unverifiedPassword){
        const encryptedUnverifiedPassword = this.encrypt(unverifiedPassword)
        return encryptedUnverifiedPassword === this.get('password')
      }
    },

    hooks:{
      // Adds a hook to generate the users token when user is created
      beforeCreate: function(user, options){
        user.setAuthToken()
      }
    }
  });
  return User;
};
