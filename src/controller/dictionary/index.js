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
    let category = await DictionaryService.queryDictCategory(1);
    // console.log(category)
    // let items = category.getDictionary();
    ctx.body = new SuccessResult({
      msg: 'success',
      data: category
    })
  }


  static async createDictionary(ctx){
    const {
      dictLabel,
      dictCode,
    } = getRequestBody(ctx);
    if(dictLabel && dictCode){
      let dictionary = await DictionaryService.findDictionary(dictLabel, dictCode);
      if(dictionary){
        ctx.body = new ErrorResult({
          code: 'air_0021',
          data: null,
        });
      }else{
        try {
          await DictionaryService.createDictionary(dictLabel, dictCode);
          ctx.body = new SuccessResult({
            data: null,
            msg: '创建字典成功'
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
  static async deleteDictionary(ctx){

  }
  static async updateDictionary(ctx){

  }
  static async queryDictionary(ctx){
    await DictionaryService.createDictionary(dictLabel, dictCode);
  }
}

module.exports = DictionaryController;
