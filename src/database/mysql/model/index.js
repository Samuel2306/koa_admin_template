const User = require('./User');
const DictionaryCategory = require('./DictionaryCategory');
const Dictionary = require('./Dictionary');
const {
  Ship,
  Captain,
} = require('./Test');

// DictionaryCategory 与 Dictionary 的一对多关系
DictionaryCategory.hasMany(Dictionary, {
  as: 'children',
  foreignKey: {
    name: 'categoryId',
    allowNull: false,
  }
});
Dictionary.belongsTo(DictionaryCategory);










module.exports = {
  DictionaryCategory,
  Dictionary,
  User,
  Ship,
  Captain,
};
