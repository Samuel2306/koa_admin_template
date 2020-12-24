const {
  DictionaryCategory,
  Dictionary,
} = require('../../database/mysql/model');
const baseConfig = require('../../config/baseConfig');

class DictionaryService {
  static async create(username){
    let user = await User.findOne({
      where: {
        userName: username
      }
    });
    return user
  }
  static async delete(fromUser, fromDatabase){
    let res = await comparePassword(fromUser, fromDatabase);
    if(!res){
      throw new Error('密码错误');
    }
  }

  static async update(fromUser, fromDatabase){
    let res = await comparePassword(fromUser, fromDatabase);
    if(!res){
      throw new Error('密码错误');
    }
  }

  static async query(fromUser, fromDatabase){
    let res = await comparePassword(fromUser, fromDatabase);
    if(!res){
      throw new Error('密码错误');
    }
  }
}


module.exports = DictionaryService;
