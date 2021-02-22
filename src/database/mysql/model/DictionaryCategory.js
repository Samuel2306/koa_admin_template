const sequelize = require('../connection');
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

