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
  static async createDictCategory(categoryName, categoryCode){
    await DictionaryCategory.create({
      categoryName: categoryName,
      categoryCode: categoryCode,
    });
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


module.exports = DictionaryService;
