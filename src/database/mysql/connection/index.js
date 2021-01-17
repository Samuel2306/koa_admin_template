const Sequelize = require('../../../sequelize');
const {
  getMysqlConfig
} = require('../../../util');
const mysqlConfig = getMysqlConfig();

// sequelize表示一个与数据库的连接
let sequelize  = new Sequelize(
  mysqlConfig.database,  // 数据库名称
  mysqlConfig.username,  // 登录数据库的用户名
  mysqlConfig.password,  // 登录数据库的密码
  {
    host: mysqlConfig.host,
    dialect: 'mysql', // 表示连接的数据库是mysql
    pool: {
      max: 5,
      min: 0,
      idle: 10000  // 连接空置时间（毫秒），超时后将释放连接
    },
    retry: {  // 设置自动查询时的重试标志
      max: 3  // 设置重试次数
    },
    timezone: '+08:00',  //东八时区
  }
);

module.exports = sequelize;
