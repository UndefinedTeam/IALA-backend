'use strict';
module.exports = (sequelize, DataTypes) => {
  var Task = sequelize.define('Task', {
    task: DataTypes.STRING,
    desc: DataTypes.STRING,
    isComplete: DataTypes.BOOLEAN,
    dateStart: DataTypes.STRING,
    dateDone: DataTypes.STRING,
  }, {
    classMethods: {
      // associate: function(models) {
      //   Task.belongsTo(models.todolist, {
      //     foreignKey: 'tasks',
      //     onDelete: 'CASCADE'
      //   })
      // }
    }
  });
  return Task;
};
