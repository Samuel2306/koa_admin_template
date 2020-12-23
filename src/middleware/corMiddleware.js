const cors = require("koa2-cors"); //导入跨域模块
const {
  getAllowOriginsConfig
} = require('../util');

// 定义允许跨域的origin
const allowOrigins = getAllowOriginsConfig()

module.exports = cors({
  origin: function(ctx) {
    if (allowOrigins.includes(ctx.header.origin)) {
      return ctx.header.origin;
    }
    return false;
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  withCredentials:true,
  allowMethods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
})
