const KoaRouter = require('koa-router');
const {
  UserController
} = require('../../controller');
const {
  createRoutesByMap
} = require('../../util');
const {
  createSvgCaptcha,
} = require('../../helpers/svgCaptcha');

let router = KoaRouter();
// 设置模块名为接口前缀
router.prefix('/api/v1/user');


let APIToFuncMap = {
  'login': 'userLogin',
  'register': 'registerUser',
};
createRoutesByMap(UserController, router, APIToFuncMap);

// 生成图片验证码
router.get('/svgCaptcha', async function(ctx, next){
  let captcha = createSvgCaptcha();
  ctx.body = String(captcha.data);
  await next();
});


// 测试接口
router.post('/getName', async function(ctx, next){
  ctx.body = {
    code: '0000',
    msg: 'success',
    data: '111',
  };
  await next();
});

module.exports = router;
