const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const Filesdownloaded = sequelize.define('filesdownloaded', { 
  id:{
    type:Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  Link: {
    type: Sequelize.STRING,
    allowNull:false,
  },
});

module.exports = Filesdownloaded;
