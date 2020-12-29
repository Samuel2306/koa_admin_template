const sequelize = require('../connection')
const {
  DataTypes,
  Model,
} = require('sequelize');

/**
 * 字典类别模型, 跟字典类是一对多关系
 */
class Dictionary extends Model {}
Dictionary.init({
  dictId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
}, {
  sequelize,
  modelName: 'Dictionary',
});

// 模型同步
Dictionary.sync({
  force: false
});

module.exports = Dictionary;

