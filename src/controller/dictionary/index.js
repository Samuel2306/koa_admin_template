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
      let categories = await DictionaryService.findCategory({
        categoryName,
        categoryCode,
        isOr: true
      });
      if(categories && categories.length){
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
      dictCategoryId,
    } = getRequestBody(ctx);
    let dictCategory = await DictionaryService.findCategoryById(dictCategoryId);
    if(dictCategory){
      try {
        await DictionaryService.deleteDictCategory(dictCategory);
        ctx.body = new SuccessResult({
          msg: '删除成功'
        });
      }catch(e){
        console.error(e);
        ctx.body = new ErrorResult({
          code: 'air_0004',
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

  static async _updateDictCategory(params, ctx) {
    let dictCategory = await DictionaryService.findCategoryById(params.dictCategoryId);
    if(dictCategory){
      try {
        await DictionaryService.updateDictCategory(params, dictCategory);
        ctx.body = new SuccessResult({
          msg: '更新成功'
        });
      }catch(e){
        console.error(e);
        ctx.body = new ErrorResult({
          code: 'air_0005',
          msg: '更新失败',
        });
      }
    }else{
      ctx.body = new ErrorResult({
        code: 'air_0022',
        msg: 'dictCategoryId对应的字典类型不存在',
      });
    }
  }

  /**
   * 更新字典类型接口
   * @param ctx
   * @returns {Promise<void>}
   */
  static async updateDictCategory(ctx){
    let params = getRequestBody(ctx);
    params = {
      dictCategoryId: params.dictCategoryId,
      categoryName: params.categoryName,
      categoryCode: params.categoryCode,
    };
    let categories = await DictionaryService.findCategory({
      categoryName: params.categoryName,
      categoryCode: params.categoryCode,
      isOr: true,
    });
    let flag = false
    categories.forEach((category) => {
      if (category.id != params.dictCategoryId) {
        flag = true;
      }
    })
    if (flag) {
      ctx.body = new ErrorResult({
        code: 'air_0020',
        msg: '已存在相同名称或者编码的字典类型',
      });
    }else{
      await DictionaryController._updateDictCategory(params, ctx);
    }
  }

  /**
   * 更改字典类型的启用状态
   * @param ctx
   * @returns {Promise<void>}
   */
  static async changeDictCategoryStatus(ctx){
    let params = getRequestBody(ctx);
    if (params.dictCategoryId == null) {
      ctx.body = new ErrorResult({
        code: 'air_0002',
        msg: '缺少dictCategoryId参数',
      });
      return;
    }
    if (params.isActive == null) {
      ctx.body = new ErrorResult({
        code: 'air_0002',
        msg: '缺少isActive参数',
      });
      return;
    }
    params = {
      dictCategoryId: params.dictCategoryId,
      isActive: params.isActive,
    };
    await DictionaryController._updateDictCategory(params, ctx)
  }

  /**
   * 字典类型查询的接口（带翻页）
   * @param ctx
   * @returns {Promise<void>}
   */
  static async queryDictCategory(ctx){
    let {
      pageSize,
      pageNum,
      categoryCodes,
      isActive,
    } = getRequestBody(ctx);
    if (!pageSize || !pageNum) {
      ctx.body = new ErrorResult({
        code: 'air_0002',
        msg: '请求参数缺失',
      });
      return;
    }
    categoryCodes = categoryCodes ? categoryCodes.split(',') : [];
    try {
      let category = await DictionaryService.queryDictCategory({pageSize, pageNum, categoryCodes, isActive});
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
        data: category,
      });
    }catch(e){
      console.log(e);
      ctx.body = new ErrorResult({
        code: 'air_0001',
        msg: '服务器错误',
      });
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
      let dictionaries = await DictionaryService.findDictionary({
        dictCategoryId,
        dictLabel,
        dictCode,
        isOr: true,
      });
      if(dictionaries && dictionaries.length){
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
        code: 'air_0002',
        msg: '请求参数缺失',
      });
    }
  }
  static async deleteDictionary(ctx){
    const {
      dictCategoryId,
      id,
    } = getRequestBody(ctx);
    let dict = await DictionaryService.findDictById({id, dictCategoryId});
    if(!dict){
      ctx.body = new ErrorResult({
        code: 'air_0023',
        msg: '字典不存在',
      });
    }else{
      try {
        await DictionaryService.deleteDictionary(dict);
        ctx.body = new SuccessResult({
          msg: '删除字典成功'
        });
      }catch(e){
        console.log(e);
        ctx.body = new ErrorResult({
          code: 'air_0004',
          msg: '删除失败',
        });
      }
    }
  }

  static async _updateDictionary(params, ctx) {
    let dict = await DictionaryService.findDictById({id: params.id, dictCategoryId: params.dictCategoryId});
    if(dict){
      try {
        await DictionaryService.updateDictCategory(params, dict);
        ctx.body = new SuccessResult({
          msg: '更新成功'
        });
      }catch(e){
        console.error(e);
        ctx.body = new ErrorResult({
          code: 'air_0005',
          msg: '更新失败',
        });
      }
    }else{
      ctx.body = new ErrorResult({
        code: 'air_0023',
        msg: '字典不存在',
      });
    }
  }

  static async updateDictionary(ctx){
    let params = getRequestBody(ctx);
    params = {
      dictCategoryId: params.dictCategoryId,
      id: params.id,
      dictLabel: params.dictLabel,
      dictCode: params.dictCode,
    };
    let dictionaries = await DictionaryService.findDictionary({
      dictCategoryId: params.dictCategoryId,
      dictLabel: params.dictLabel,
      dictCode: params.dictCode,
      isOr: true,
    });
    let flag = false;
    dictionaries.forEach((dict) => {
      if (dict.id != params.id) {
        flag = true;
      }
    });
    if (flag) {
      ctx.body = new ErrorResult({
        code: 'air_0020',
        msg: '已存在相同名称或者编码的字典',
      });
    }else{
      await DictionaryController._updateDictionary(params, ctx)
    }
  }
  static async changeDictionaryStatus(ctx) {
    let params = getRequestBody(ctx);
    if (params.dictCategoryId == null) {
      ctx.body = new ErrorResult({
        code: 'air_0002',
        msg: '缺少dictCategoryId参数',
      });
      return;
    }
    if (params.isActive == null) {
      ctx.body = new ErrorResult({
        code: 'air_0002',
        msg: '缺少isActive参数',
      });
      return;
    }
    if (params.id == null) {
      ctx.body = new ErrorResult({
        code: 'air_0002',
        msg: '缺少id参数',
      });
      return;
    }
    params = {
      dictCategoryId: params.dictCategoryId,
      id: params.id,
      isActive: params.isActive,
    };
    await DictionaryController._updateDictionary(params, ctx)
  }
  static async queryDictionary(ctx){
    const {
      pageSize,
      pageNum,
      dictCategoryId,
      isActive,
    } = getRequestBody(ctx);

    try {
      let res = await DictionaryService.queryDictionary({
        pageSize,
        pageNum,
        dictCategoryId,
        isActive,
      });
      if(isActive != undefined){
        res = res.filter((item) => {
          return item == isActive;
        })
      }
      ctx.body = new SuccessResult({
        msg: 'success',
        data: res
      })
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
