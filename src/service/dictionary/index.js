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
  static async updateDictCategory({categoryName, categoryCode}){
    await DictionaryCategory.save({
      categoryCode: categoryCode
    });
  }
  static async queryDictCategory(categoryId, isActive){
    const conditions = isActive == null ? {
      categoryId: categoryId,
    } : {
      categoryId: categoryId,
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







  static async findDictByName(dictLabel){
    let dictionary = Dictionary.findOne({
      where: {
        dictLabel: dictLabel
      }
    })
    return dictionary
  }
  static async findDictByCode(dictCode){
    let dictionary = Dictionary.findOne({
      where: {
        dictCode: dictCode
      }
    })
    return dictionary;
  }
  static async findDictionary(dictLabel, dictCode){
    let dictionary = null;
    await Promise.all([DictionaryService.findDictByName(dictLabel), DictionaryService.findDictByCode(dictCode)])
      .then((res) => {
        dictionary = res && res.length ? res.filter((item) => {return !!item})[0] : null;
      })
    return dictionary
  }
  static async createDictionary(dictLabel, dictCode){

  }

  static async deleteDictionary(ctx){

  }
  static async updateDictionary(ctx){

  }
  static async queryDictionary(categoryId){

  }
}


module.exports = DictionaryService;
