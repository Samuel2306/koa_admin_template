const sequelize = require('../connection')
const {
  DataTypes,
} = require('sequelize');


const Dictionary = sequelize.define('dictionary', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  dictLabel: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'dictLabel',
  },
  dictCode: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'dictCode',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    field: 'isActive',
  },
});


module.exports = Dictionary;

