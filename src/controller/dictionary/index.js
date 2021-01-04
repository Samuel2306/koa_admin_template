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
      let category = await DictionaryService.findCategory({categoryName, categoryCode}, true);
      if(category){
        ctx.body = new ErrorResult({
          code: 'air_0020',
          msg: '已存在相同名称或者编码的字典类型',
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
            msg: e.message,
          });
        }
      }
    }else{
      ctx.body = new ErrorResult({
        mag: '请求参数缺失',
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
        msg: 'categoryCode对应的字典类型不存在',
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
          msg: '更新失败',
        });
      }
    }else{
      ctx.body = new ErrorResult({
        code: 'air_0022',
        msg: 'categoryCode对应的字典类型不存在',
      });
    }
  }
  static async queryDictCategory(ctx){
    let {
      categoryCodes,
      isActive,
    } = getRequestBody(ctx);
    categoryCodes = categoryCodes.split(',');
    try {
      let category = await DictionaryService.queryDictCategory(categoryCodes, isActive);
      ctx.body = new SuccessResult({
        msg: 'success',
        data: category
      })
    }catch(e){
      console.log(e);
      ctx.body = new ErrorResult({
        code: 'air_0001',
        msg: '服务器错误',
      })
    }
  }
  // 根据用户传入的code列表返回字典列表，是给前端使用的接口
  static async getDictionariesByCodes(ctx){
    let {
      categoryCodes,
    } = getRequestBody(ctx);
    categoryCodes = categoryCodes ? categoryCodes.split(',') : [];
    try {
      let category = await DictionaryService.queryDictCategory(categoryCodes);
      ctx.body = new SuccessResult({
        msg: 'success',
        data: category
      })
    }catch(e){
      console.log(e);
      ctx.body = new ErrorResult({
        code: 'air_0001',
        msg: '服务器错误',
      })
    }
  }


  /**
   * 字典选项相关接口
   */
  static async createDictionary(ctx){
    const {
      dictCategoryId,
      dictLabel,
      dictCode,
    } = getRequestBody(ctx);
    if(dictLabel && dictCode && dictCategoryId){
      let category = await DictionaryService.findCategoryById(dictCategoryId);
      if(category){
        let dictionaries = await category.getChildren() || [];
        dictionaries = dictionaries.filter((item) => {
          return item.dictLabel == dictLabel || item.dictCode == dictCode
        });
        /**
         * 如果已经存在相应的字典，就返回一个错误结果
         */
        if(dictionaries.length){
          ctx.body = new ErrorResult({
            code: 'air_0021',
            msg: '已存在相同名称或者编码的字典选项',
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
          msg: 'categoryCode对应的字典类型不存在',
        });
      }
    }else{
      ctx.body = new ErrorResult({
        code: 'air_0002',
        msg: '请求参数缺失',
      });
    }
  }
  static async deleteDictionary(ctx){
    const {
      dictCategoryId,
      dictCode,
    } = getRequestBody(ctx);
    let category = await DictionaryService.findCategoryById(dictCategoryId);
    if(!category){
      ctx.body = new ErrorResult({
        code: 'air_0022',
        msg: 'categoryCode对应的字典类型不存在',
      });
    }else{
      let dictionaries = await category.getChildren() || [];
      let res = dictionaries.filter((item) => {
        return item.dictCode == dictCode;
      });
      if(res.length){
        let dict = res[0];
        try {
          await DictionaryService.deleteDictionary(dict);
          ctx.body = new SuccessResult({
            msg: '删除字典成功'
          });
        }catch(e){
          console.log(e);
          ctx.body = new ErrorResult({
            code: 'air_0003',
            msg: '删除失败',
          });
        }
      }else{
        ctx.body = new ErrorResult({
          code: 'air_0023',
          msg: 'dictCode对应的字典不存在',
        });
      }
    }
  }
  static async updateDictionary(ctx){
    const {
      dictCategoryId,
      dictLabel,
      dictCode,
      isActive = 0,
    } = getRequestBody(ctx);
    if(dictLabel && dictCode && dictCategoryId){
      let category = await DictionaryService.findCategoryById(dictCategoryId);
      if(category){
        let dictionaries = await category.getChildren() || [];
        let dictionary = dictionaries.filter((item) => {
          return item.dictCode == dictCode
        })[0];
        if(!dictionary){
          ctx.body = new ErrorResult({
            code: 'air_0023',
            msg: 'dictCode对应的字典不存在',
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
          msg: 'categoryCode对应的字典类型不存在',
        });
      }
    }else{
      ctx.body = new ErrorResult({
        code: 'air_0002',
        msg: '请求参数缺失',
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
          msg: 'categoryCode对应的字典类型不存在',
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
        msg: '服务器错误'
      })
    }
  }
  /**
   * 字典选项相关接口
   */
}

module.exports = DictionaryController;
