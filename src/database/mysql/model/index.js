const User = require('./User');
const DictionaryCategory = require('./DictionaryCategory');
const Dictionary = require('./Dictionary');

// DictionaryCategory 与 Dictionary 的一对多关系
DictionaryCategory.hasMany(Dictionary, {
  as: 'dictionaries',
  foreignKey: 'categoryId'
});
Dictionary.belongsTo(DictionaryCategory);

module.exports = {
  DictionaryCategory,
  Dictionary,
  User,
};
