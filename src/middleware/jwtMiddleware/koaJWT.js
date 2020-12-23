/**
 * jsonwebtoken：提供token的产生和校验
 * koa-jwt：只是让koa框架拥有jwt鉴权的功能，会自动从一个叫Authorization的请求头去获取Bearer + token的数据
 * 用户token实现逻辑：
 * 1、用户登录获取相应的token，作为身份标识，每次请求都要求将token在请求头中带给后台
 * 2、用户的token存在一定的过期时间，比如说半个小时
 * 3、后台获取token以后，先解析token是否合法，合法再获取token的过期时间点，然后通过过期时间和当前系统时间
 *    的对比得出一个时间差，最后再判断这个时间差是否在你允许的范围内，允许则过，不允许则401抛token无效，这个
 *    401错误应该是jwt模块抛出的。
 */
const KoaJWT = require('koa-jwt');
const baseConfig = require('../../config/baseConfig');
// 定义公共路径，不需要JWT鉴权
const koa_jwt = KoaJWT({
  secret: baseConfig.jwt.secret,
})
  .unless({
    path: [
      /^\/public/i,  // public打头的目录
      /\/login$/i,
      /\/register$/i,
      /\/error$/i,
      /\/createSvgCaptcha$/i,
    ],
  });
module.exports = koa_jwt;
