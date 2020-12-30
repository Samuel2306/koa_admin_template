const User = require('./User');
const DictionaryCategory = require('./DictionaryCategory');
const Dictionary = require('./Dictionary');

// DictionaryCategory 与 Dictionary 的一对多关系
DictionaryCategory.hasMany(Dictionary, {
  as: 'children'
});
Dictionary.belongsTo(DictionaryCategory);


/**
 * 注意点：模型同步一定要放在建立关联关系之后，不然会有问题
 */
// 模型同步
Dictionary.sync({
  force: false
});

// 模型同步
DictionaryCategory.sync({
  force: false
});




module.exports = {
  DictionaryCategory,
  Dictionary,
  User,
};
