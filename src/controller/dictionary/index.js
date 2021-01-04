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








  /* 字典选项接口 */
  static async createDictionary(ctx){
    const {
      dictCategoryId,
      dictLabel,
      dictCode,
    } = getRequestBody(ctx);
    if(dictLabel && dictCode && dictCategoryId){
      let category = await DictionaryService.findCategoryById(dictCategoryId);
      if(category){
        let dictionary = await DictionaryService.findDictionary({dictLabel, dictCode, dictCategoryId});
        /**
         * 如果已经存在相应的字典，就返回一个错误结果
         */
        if(dictionary){
          ctx.body = new ErrorResult({
            code: 'air_0021',
          });
        }else{
          try {
            await DictionaryService.createDictionary({dictLabel, dictCode, dictCategoryId});
            ctx.body = new SuccessResult({
              msg: '创建字典成功'
            });
          }catch(e){
            console.error(e);
            ctx.body = new ErrorResult({
              code: 'air_0001',
              msg: '创建字典失败',
            });
          }
        }
      }else{
        ctx.body = new ErrorResult({
          code: 'air_0022',
        });
      }
    }else{
      ctx.body = new ErrorResult({
        code: 'air_0002',
      });
    }

  }
  static async deleteDictionary(ctx){
    const {
      dictCategoryId,
      dictCode,
    } = getRequestBody(ctx);
    let dict = await DictionaryService.findDictByCode({dictCode, dictCategoryId});
    if(dict){
      try {
        await DictionaryService.deleteDictionary(dict);
        ctx.body = new SuccessResult({
          msg: '删除字典成功'
        });
      }catch(e){
        console.log(e);
        ctx.body = new ErrorResult({
          code: 'air_0003',
        });
      }
    }else{
      ctx.body = new ErrorResult({
        code: 'air_0023',
      });
    }
  }
  static async updateDictionary(ctx){
    const {
      dictCategoryId,
      dictLabel,
      dictCode,
      isActive
    } = getRequestBody(ctx);
    if(dictLabel && dictCode && dictCategoryId){
      let category = await DictionaryService.findCategoryById(dictCategoryId);
      if(category){
        let dictionary = await DictionaryService.findDictByCode({dictCode, dictCategoryId});
        if(!dictionary){
          ctx.body = new ErrorResult({
            code: 'air_0023',
          });
        }else{
          try {
            await DictionaryService.updateDictionary({dictLabel, isActive}, dictionary);
            ctx.body = new SuccessResult({
              msg: '更新字典成功'
            });
          }catch(e){
            console.error(e);
            ctx.body = new ErrorResult({
              code: 'air_0004',
              msg: '更新字典失败',
            });
          }
        }
      }else{
        ctx.body = new ErrorResult({
          code: 'air_0022',
        });
      }
    }else{
      ctx.body = new ErrorResult({
        code: 'air_0002',
      });
    }
  }
  static async queryDictionary(ctx){
    const {
      dictCategoryId,
      isActive,
    } = getRequestBody(ctx);

    try {
      let category = await DictionaryService.findCategoryById(dictCategoryId);
      if(!category){
        ctx.body = new ErrorResult({
          code: 'air_0022',
        });
      }else{
        let res = await DictionaryService.queryDictionary(category);
        if(isActive != undefined){
          res = res.filter((item) => {
            return item == isActive;
          })
        }
        ctx.body = new SuccessResult({
          msg: 'success',
          data: res
        })
      }
    }catch(e){
      console.log(e);
      ctx.body = new ErrorResult({
        code: 'air_0001',
      })
    }
  }
}

module.exports = DictionaryController;
