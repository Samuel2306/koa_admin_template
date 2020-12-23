const mysqlConnection = require('./database/mysql/connection');

mysqlConnection.authenticate()
  .then(function() {
    console.log("数据库连接成功");
    const app = require('./server');
    app();
  })
  .catch(function(err) {
    //数据库连接失败时打印输出
    console.error(err);
    throw err;
  });
