const sequelize = require('../connection')
const {
  DataTypes,
  Model,
} = require('sequelize');
const {
  encrypt,
} = require('../../../helpers/encrypt');

/**
 * 定义一个模型，模型对应数据库里面的表
 * 注意点：像下面的这种定义方式，我们并未给出表名，Sequelize 会自动将模型名复数并将其用作表名。
 */
class User extends Model {}
User.init({
  userId: {
    type: DataTypes.INTEGER, // number类型
    primaryKey: true,  // 主键
    allowNull: false,  // 是否允许为空
    autoIncrement: true, // 自动增加
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'userName'  // 字段名称
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'password',
    set(value) {
      // 在数据库中以明文形式存储密码是很糟糕的, 使用适当的哈希函数来加密哈希值更好.
      this.setDataValue('password', encrypt(value))
    }
  }
},{
  sequelize, // 数据库连接实例
  modelName: 'User' // 模型名称
})

// 模型同步
User.sync({
  force: false
});

module.exports = User;
