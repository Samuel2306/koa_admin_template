const { Op } = require("sequelize");
const {
  DictionaryCategory,
  Dictionary,
  Ship,
} = require('../../database/mysql/model');

class DictionaryService {
  static async findCategoryByName(categoryName){
    let dictCategory = DictionaryCategory.findOne({
      where: {
        categoryName: categoryName,
        deletedAt: {
          [Op.is]: null,
        },
      }
    });
    return dictCategory
  }
  static async findCategoryByCode(categoryCode){
    let dictCategory = DictionaryCategory.findOne({
      where: {
        categoryCode: categoryCode,
        deletedAt: {
          [Op.is]: null,
        },
      }
    });
    return dictCategory;
  }
  static async findCategoryById(id){
    let dictCategory = DictionaryCategory.findOne({
      where: {
        id: id,
        deletedAt: {
          [Op.is]: null,
        },
      }
    });
    return dictCategory;
  }

  /**
   * 查询字典类型
   * @param categoryName
   * @param categoryCode
   * @param isOr: true / false，表示搜索条件是 && 还是 ||
   * @returns {Promise<*>}
   */
  static async findCategory({categoryName, categoryCode, isOr}){
    let dictCategory = null;
    if(isOr){
      await Promise.all([
        DictionaryService.findCategoryByName(categoryName),
        DictionaryService.findCategoryByCode(categoryCode),
      ])
        .then((res) => {
          dictCategory = res && res.length ? res.filter((item) => {return !!item}) : null;
        });
    }else{
      dictCategory = await DictionaryCategory.findOne({
        where: {
          categoryName: categoryName,
          categoryCode: categoryCode,
          deletedAt: {
            [Op.is]: null,
          },
        }
      });
    }
    return dictCategory
  }

  /**
   * 创建字典类型
   * @param categoryName：类型名称
   * @param categoryCode：类型code
   * @returns {Promise<void>}
   */
  static async createDictCategory({categoryName, categoryCode}){
    await DictionaryCategory.create({
      categoryName: categoryName,
      categoryCode: categoryCode,
    });
  }

  /**
   * 删除字典类型
   * @param dictCategory：字典类型实例
   * @returns {Promise<void>}
   */
  static async deleteDictCategory(dictCategory){
    await dictCategory.destroy();
  }

  /**
   * 更新字典类型
   * @param categoryName
   * @param isActive
   * @param dictCategory
   * @returns {Promise<void>}
   */
  static async updateDictCategory(params, dictCategory){
    for (let prop in params) {
      dictCategory[prop] = params[prop];
    }
    await dictCategory.save();
  }

  /**
   * 查询字典
   * @param categoryCode
   * @param isActive
   * @returns {Promise<Model[] | Array<Model>>}
   */
  static async queryDictCategory({
    pageSize,
    pageNum,
    categoryCodes,
    isActive,
  }){
    const offset = parseInt(pageSize * (pageNum - 1));
    const limit = parseInt(pageSize);
    let categories = await DictionaryCategory.findAndCountAll({
      distinct: true,  // 这个必须加，不然每一条Dictionary数据也会被计数
      offset: offset,
      limit: limit,
      where: {
        categoryCode: {
          [Op.or]: categoryCodes,
        },
        isActive: {
          [Op.or]: isActive,
        },
      },
      paranoid: false,
    });

    return categories;
  }

  // 根据用户传入的code列表返回字典列表，是给前端使用的接口
  static async getDictionariesByCodes(categoryCodes){
    let categories = await DictionaryCategory.scope('defaultScope', 'activated', 'activeDictionaries').findAll({
      distinct: true,  // 这个必须加，不然每一条Dictionary数据也会被计数
      where: {
        categoryCode: {
          [Op.or]: categoryCodes,
        },
      },
      // paranoid: false, 检索出被软删除的数据
    });
    return categories
  }






  /* 字典选项相关 */
  static async findDictByName({dictLabel, dictCategoryId}){
    let dictionary = Dictionary.findOne({
      where: {
        dictLabel: dictLabel,
        dictCategoryId: dictCategoryId,
      }
    })
    return dictionary
  }
  static async findDictByCode({dictCode, dictCategoryId}){
    let dictionary = Dictionary.findOne({
      where: {
        dictCode: dictCode,
        dictCategoryId: dictCategoryId,
      }
    });
    return dictionary;
  }
  static async findDictById({id, dictCategoryId}){
    let dictionary = Dictionary.findOne({
      where: {
        id: id,
        dictCategoryId: dictCategoryId,
      }
    })
    return dictionary;
  }
  static async findDictionary({dictLabel, dictCode, dictCategoryId, isOr}){
    let dictionary = null;
    if (isOr) {
      await Promise.all([DictionaryService.findDictByName({dictLabel, dictCategoryId}), DictionaryService.findDictByCode({dictCode, dictCategoryId})])
        .then((res) => {
          dictionary = res && res.length ? res.filter((item) => {return !!item}) : null;
        })
    } else{
      dictionary = await Dictionary.findOne({
        where: {
          dictCategoryId,
          dictLabel,
          dictCode,
        }
      })
    }

    return dictionary
  }

  static async createDictionary({dictLabel, dictCode, dictCategoryId}){
    await Dictionary.create({
      dictLabel,
      dictCode,
      dictCategoryId
    })
  }
  static async deleteDictionary(dict){
    await dict.destroy();
  }
  static async updateDictionary({dictLabel, isActive}, dictionary){
    dictionary.dictLabel = dictLabel || dictionary.dictLabel;
    dictionary.dictCode = dictLabel || dictionary.dictCode;
    dictionary.isActive = isActive || dictionary.isActive;
    await dictionary.save();
  }
  static async queryDictionary({pageSize, pageNum, dictCategoryId,}){
    const offset = parseInt(pageSize * (pageNum - 1));
    const limit = parseInt(pageSize);
    let dictionaries = await Dictionary.findAndCountAll({
      distinct: true,  // 这个必须加，不然每一条Dictionary数据也会被计数
      offset: offset,
      limit: limit,
      where: {
        dictCategoryId: dictCategoryId,
      },
    });
    return dictionaries;
  }
}


module.exports = DictionaryService;
