const sequelize = require('../connection');
const {
  DataTypes,
  Op,
} = require('sequelize');
const Dictionary = require('./Dictionary');


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
    // unique: true,
    /*set(value) {
      this.setDataValue('categoryName', value);
    },
    get() {
      return this.getDataValue('categoryName');
    },*/
  },
  categoryCode: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'categoryCode',
    // unique: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    field: 'isActive',
    defaultValue: 0,
  },
}, {
  defaultScope: {
    order: [
      ['createdAt', 'DESC'],
    ],
  },
  scopes: {
    deleted: {
      where: {
        deletedAt: {
          [Op.ne]: null,
        },
      }
    },
    activated: {
      where: {
        isActive: true,
      }
    },
    unactivated: {
      where: {
        isActive: false,
      }
    },
    activeDictionaries: {
      include: [
        {
          model: Dictionary,
          as: 'children',  // 定义属性别名
          where: {
            isActive: true
          },
          required: false,  // 使用left join，默认是使用inner join，这样就算dictCategory底下没有相应的Dictionary，也会被搜索出来
        }
      ]
    },
  },
  paranoid: true,  // 实现逻辑删除
  /*getterMethods: {
    categoryCode: () => {
      return this.getDataValue('categoryCode');
    }
  },
  setterMethods: {
    categoryCode: (value) => {
      this.setDataValue('categoryCode', value);
    }
  },*/
});


module.exports = DictionaryCategory;

