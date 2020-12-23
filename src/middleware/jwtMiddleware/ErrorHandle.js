const {
  ErrorResult,
} = require('../../helpers/result');

module.exports = async (ctx, next) => {
  return await next().catch((err) => {
    if(err.status == 101){ // token过期
      ctx.body = new ErrorResult({
        code: 'air_0014',
        data: null
      });
    }else if(err.status == 401){ // token不合法
      ctx.body = new ErrorResult({
        code: 'air_0015',
        data: null,
        msg: 'Protected resource, use Authorization header to get access',
      });
    }else{
      // 服务器错误
      ctx.body = new ErrorResult({
        code: 'air_0001',
        data: null,
        msg: 'Server error',
      });
    }
  })
}
