const sequelize = require('../connection')
const {
  DataTypes,
} = require('sequelize');


const DictionaryCategory = sequelize.define('dictCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  categoryName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'categoryName',
    unique: true,
  },
  categoryCode: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'categoryCode',
    unique: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    field: 'isActive',
    defaultValue: 0,
  },
});


module.exports = DictionaryCategory;

