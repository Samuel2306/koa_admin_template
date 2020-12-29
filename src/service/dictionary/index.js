const { Op } = require("sequelize");
const {
  DictionaryCategory,
  Dictionary,
} = require('../../database/mysql/model');

class DictionaryService {
  static async findCategoryByName(categoryName){
    let dictCategory = DictionaryCategory.findOne({
      where: {
        categoryName: categoryName
      }
    })
    return dictCategory
  }
  static async findCategoryByCode(categoryCode){
    let dictCategory = DictionaryCategory.findOne({
      where: {
        categoryCode: categoryCode
      }
    })
    return dictCategory;
  }
  static async findCategoryById(categoryId){
    let dictCategory = DictionaryCategory.findOne({
      where: {
        categoryId: categoryId
      }
    })
    return dictCategory;
  }
  static async findCategory(categoryName, categoryCode){
    let dictCategory = null;
    await Promise.all([DictionaryService.findCategoryByName(categoryName), DictionaryService.findCategoryByCode(categoryCode)])
      .then((res) => {
        dictCategory = res && res.length ? res.filter((item) => {return !!item})[0] : null;
      })
    return dictCategory
  }

  static async createDictCategory({categoryName, categoryCode}){
    await DictionaryCategory.create({
      categoryName: categoryName,
      categoryCode: categoryCode,
      isActive: false
    });
  }
  static async deleteDictCategory(dictCategory){
    dictCategory.destroy();
  }
  static async updateDictCategory({categoryName, isActive}, dictCategory){
    dictCategory.categoryName = categoryName || dictCategory.categoryName;
    dictCategory.isActive = isActive || dictCategory.isActive;
    await dictCategory.save();
  }
  static async queryDictCategory(categoryCode, isActive){
    const conditions = isActive == null ? {
      categoryCode: {
        [Op.or]: categoryCode,
      },
    } : {
      categoryCode: {
        [Op.or]: categoryCode,
      },
      isActive: isActive,
    };
    let category = await DictionaryCategory.findAll({
      where: conditions,
      include: {
        attributes: [ 'categoryId', 'dictId', 'dictLabel', 'dictCode', 'isActive' ],
        model: Dictionary,
        as: 'children',  // 定义属性别名
      },
    });
    return category;
  }






  /* 字典选项相关 */
  static async findDictByName({dictLabel, categoryId}){
    let dictionary = Dictionary.findOne({
      where: {
        dictLabel: dictLabel,
        categoryId: categoryId,
      }
    })
    return dictionary
  }
  static async findDictByCode({dictCode, categoryId}){
    let dictionary = Dictionary.findOne({
      where: {
        dictCode: dictCode,
        categoryId: categoryId,
      }
    })
    return dictionary;
  }
  static async findDictionary({dictLabel, dictCode, categoryId}){
    let dictionary = null;
    await Promise.all([DictionaryService.findDictByName({dictLabel, categoryId}), DictionaryService.findDictByCode({dictCode, categoryId})])
      .then((res) => {
        dictionary = res && res.length ? res.filter((item) => {return !!item})[0] : null;
      })
    return dictionary
  }
  static async createDictionary({dictLabel, dictCode, categoryId}){
    await Dictionary.create({
      dictLabel,
      dictCode,
      categoryId,
      isActive: false
    })
  }

  static async deleteDictionary(dict){
    dict.destroy();
  }
  static async updateDictionary(ctx){

  }
  static async queryDictionary(categoryId){

  }
}


module.exports = DictionaryService;
