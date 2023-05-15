const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const Expense = sequelize.define('expense', { 
  id:{
    type:Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  Amount: {
    type: Sequelize.INTEGER,
    allowNull:false,
  },
  Description: {
    type: Sequelize.STRING,
    allowNull:false,
  },
  Catogary: {
    type: Sequelize.STRING,
    allowNull:false,
  },
});

module.exports = Expense;
