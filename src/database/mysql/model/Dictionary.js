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
    defaultValue: 0
  },
}, {
  paranoid: true,  // 实现逻辑删除
  defaultScope: {
    order: [
      ['createdAt', 'DESC'],
    ],
  },
  scopes: {
    activated: {
      where: {
        isActive: true,
      }
    },
    unactivated: {
      where: {
        isActive: false,
      }
    }
  },
});


module.exports = Dictionary;

