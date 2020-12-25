const {
  DictionaryService,
}  = require('../../service');
const {
  SuccessResult,
  ErrorResult,
} = require('../../helpers/result');
const {
  getRequestBody,
} = require('../../util');

class DictionaryController {
  static async createDictCategory(ctx){
    const {
      categoryName,
      categoryCode,
    } = getRequestBody(ctx);
    if(categoryName && categoryCode){
      let category = await DictionaryService.findCategory(categoryName, categoryCode);
      if(category){
        ctx.body = new ErrorResult({
          code: 'air_0020',
          data: null,
        });
      }else{
        try {
          await DictionaryService.createDictCategory(categoryName, categoryCode);
          ctx.body = new SuccessResult({
            data: null,
            msg: '创建字典类型成功'
          });
        }catch(e){
          console.error(e);
          ctx.body = new ErrorResult({
            code: 'air_0001',
            data: null,
          });
        }
      }
    }else{
      ctx.body = new ErrorResult({
        code: 'air_0002',
        data: null,
      });
    }
  }
  static async deleteDictCategory(ctx){

  }
  static async updateDictCategory(ctx){

  }
  static async queryDictCategory(ctx){

  }
  static async createDictionary(ctx){

  }
  static async deleteDictionary(ctx){

  }
  static async updateDictionary(ctx){

  }
  static async queryDictionary(ctx){

  }
}

module.exports = DictionaryController;
