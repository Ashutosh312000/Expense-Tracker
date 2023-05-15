const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const User = sequelize.define('user', { 
  id:{
    type:Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  Name: {
    type: Sequelize.STRING,
    allowNull:false,
  },
  total_expense: {
    type: Sequelize.INTEGER,
    allowNull:false,
  },
  Email: {
    type: Sequelize.STRING,
    allowNull:false,
    unique: true,
  },
  Password: {
    type: Sequelize.STRING,
    allowNull:false,
  },
  ispremiumuser:{
    type: Sequelize.BOOLEAN,
    allowNull:true,
  }
});

module.exports = User;
