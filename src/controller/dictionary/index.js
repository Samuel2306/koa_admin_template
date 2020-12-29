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

        });
      }else{
        try {
          await DictionaryService.createDictCategory({categoryName, categoryCode});
          ctx.body = new SuccessResult({

            msg: '创建成功'
          });
        }catch(e){
          console.error(e);
          ctx.body = new ErrorResult({
            code: 'air_0001',

          });
        }
      }
    }else{
      ctx.body = new ErrorResult({
        code: 'air_0002',

      });
    }
  }
  static async deleteDictCategory(ctx){
    const {
      categoryCode,
    } = getRequestBody(ctx);
    let dictCategory = await DictionaryService.findCategoryByCode(categoryCode);
    if(dictCategory){
      try {
        await DictionaryService.deleteDictCategory(dictCategory);
        ctx.body = new SuccessResult({
          msg: '删除成功'
        });
      }catch(e){
        console.error(e);
        ctx.body = new ErrorResult({
          code: 'air_0003',
          msg: '删除失败',
        });
      }
    }else{
      ctx.body = new ErrorResult({
        code: 'air_0022',
      });
    }
  }
  static async updateDictCategory(ctx){
    const {
      categoryName,
      categoryCode,
      isActive,
    } = getRequestBody(ctx);

    let dictCategory = await DictionaryService.findCategoryByCode(categoryCode);
    if(dictCategory){
      try {
        await DictionaryService.updateDictCategory({
          categoryName,
          isActive,
        }, dictCategory);
        ctx.body = new SuccessResult({
          msg: '更新成功'
        });
      }catch(e){
        console.error(e);
        ctx.body = new ErrorResult({
          code: 'air_0004',
        });
      }
    }else{
      ctx.body = new ErrorResult({
        code: 'air_0022',
      });
    }
  }
  static async queryDictCategory(ctx){
    let {
      categoryCode,
    } = getRequestBody(ctx);
    categoryCode = categoryCode.split(',');
    try {
      let category = await DictionaryService.queryDictCategory(categoryCode);
      ctx.body = new SuccessResult({
        msg: 'success',
        data: category
      })
    }catch(e){
      console.log(e);
      ctx.body = new ErrorResult({
        code: 'air_0001',
      })
    }
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
        });
      }else{
        try {
          await DictionaryService.createDictionary(dictLabel, dictCode);
          ctx.body = new SuccessResult({
            msg: '创建字典成功'
          });
        }catch(e){
          console.error(e);
          ctx.body = new ErrorResult({
            code: 'air_0001',
          });
        }
      }
    }else{
      ctx.body = new ErrorResult({
        code: 'air_0002',
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
