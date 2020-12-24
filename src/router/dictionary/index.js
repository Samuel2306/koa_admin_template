const KoaRouter = require('koa-router');
const {
  DictionaryController
} = require('../../controller');
const {
  createRoutesByMap
} = require('../../util');

let router = KoaRouter();
// 设置模块名为接口前缀
router.prefix('/api/v1/dictionary');

let APIToFuncMap = {
  'createDictCategory': 'createDictCategory',
  'deleteDictCategory': 'deleteDictCategory',
  'updateDictCategory': 'updateDictCategory',
  'queryDictCategory': 'queryDictCategory',

  'createDictionary': 'createDictionary',
  'deleteDictionary': 'deleteDictionary',
  'updateDictionary': 'updateDictionary',
  'queryDictionary': 'queryDictionary',
};
createRoutesByMap(DictionaryController, router, APIToFuncMap);
module.exports = router;
