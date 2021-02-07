const sequelize = require('../connection')
const {
  DataTypes,
} = require('sequelize');

const Ship = sequelize.define('ship', { name: DataTypes.STRING }, { timestamps: false });


module.exports = Ship;
