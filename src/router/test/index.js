const KoaRouter = require('koa-router');
const {
  Ship,
  Captain,
} = require('../../database/mysql/model/Test.js');

let router = KoaRouter();
// 设置模块名为接口前缀
router.prefix('/api/v1/test');

// 测试接口
router.post('/modelTest', async function(ctx, next){
  const awesomeCaptain = await Captain.findOne({
    where: {
      name: "Jack Sparrow"
    }
  });
  console.log(awesomeCaptain);
  ctx.body = {
    code: '0000',
    msg: 'success',
    data: '111',
  };
  await next();
});

module.exports = router;
