const sequelize = require('../connection')
const {
  DataTypes,
  Model,
} = require('sequelize');

/**
 * 字典类别模型, 跟字典类是一对多关系
 */
class DictionaryCategory extends Model {}
DictionaryCategory.init({
  categoryId: {
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
  },
}, {
  sequelize,
  modelName: 'dictCategory',
});

// 模型同步
DictionaryCategory.sync({
  force: false
});

module.exports = DictionaryCategory;

