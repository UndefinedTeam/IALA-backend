'use strict';
module.exports = (sequelize, DataTypes) => {
  var TodoList = sequelize.define('TodoList', {
    title: DataTypes.STRING,
    type: DataTypes.STRING,
    isComplete: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        TodoList.belongsTo(models.User, {
          foreignKey: 'userId',
          onDelete: 'CASCADE'
        })
      },
      associate: function(models) {
        TodoList.hasMany(models.Task, {
          foreignKey: 'listId',
          as: 'tasks'
        })
      }
    }
  });
  return TodoList;
};
