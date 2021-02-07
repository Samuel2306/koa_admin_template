const KoaRouter = require('koa-router');
const {
  // Ship,
  // Captain,
} = require('../../database/mysql/model/Test.js');

const {
  DictionaryCategory,
  Dictionary,
} = require('../../database/mysql/model');

let router = KoaRouter();
// 设置模块名为接口前缀
router.prefix('/api/v1/test');

// 测试接口
router.post('/modelTest', async function(ctx, next){
  let category = await DictionaryCategory.findOne();
  let dict = await Dictionary.create({
    dictLabel: '自定义布局',
    dictCode: 'customize',
    dictCategoryId: 1,
  });
  let dict1 = await Dictionary.create({
    dictLabel: '单列布局',
    dictCode: 'singleColumn',
    dictCategoryId: 1,
  });
  let dict2 = await Dictionary.create({
    dictLabel: '双列布局',
    dictCode: 'twoColumns',
    dictCategoryId: 1,
  });
  category.addChildren([dict, dict1, dict2]);

  ctx.body = {
    code: '0000',
    msg: 'success',
    data: '111',
  };
  await next();
});

module.exports = router;
