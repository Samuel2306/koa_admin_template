/**
 * koa2的session的中间件：koa2原生功能只提供了cookie的操作，但是没有提供session操作。session只能自己实现或者通过第三方中间件。
 * 数据库存储方案：
 *  • 将session存放在Redis数据库中;
 *  • 需要用到中间件:
 *      koa-generic-session koa2 处理session的中间件，提供存储介质的读写接口 。
 *      koa-redis 为 koa-generic-session 中间件提供 Redis 数据库的 session 数据读写操作。
 *      将 sessionId 和对应的数据存到数据库
 *  • 将数据库的存储的sessionId存到页面的cookie中
 *  • 根据cookie的sessionId去获取对应的session信息
 */
const session = require('koa-generic-session');
const Redis = require('koa-redis');
const util = require('../util');
const redisConfig = util.getRedisConfig();

function useRedisMiddleware(app){
  // session做加密处理的密钥
  app.keys = redisConfig.sessionKeys;
  app.use(session({
    key: "SESSION_ID",  // 设置cookie，用户浏览器会自动在cookie中保存名为SESSION_ID和SESSION_ID.sig的信息
    prefix: "koa:vpc:",  // 保存键的前缀，保证键名不冲突
    cookie: {
      path: '/',
      httpOnly: true, // true: 不允许浏览器中的js代码来获取cookie，避免遭到一些恶意代码的攻击
      maxAge: 24 * 60 * 60 * 1000, //one day in ms,
      overwrite: true,
      signed: true
    },
    // 不配置store的话，session默认存在内存中，这里我们使用Redis
    store: new Redis({
      all: `${redisConfig.host}${redisConfig.port}`
    }) // 不传参数，默认指向本机的redis
  }))
}
useRedisMiddleware.isComplex = true
module.exports = useRedisMiddleware

