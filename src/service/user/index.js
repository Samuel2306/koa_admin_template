const User = require('../../database/mysql/model/user');
const {
  comparePassword,
} = require('../../helpers/encrypt');
const jwt = require('jsonwebtoken'); //jwt认证与授权
const baseConfig = require('../../config/baseConfig');

class UserService {
  static async findUserByUserName(username){
    let user = await User.findOne({
      where: {
        userName: username
      }
    });
    return user
  }
  static async checkPassword(fromUser, fromDatabase){
    let res = await comparePassword(fromUser, fromDatabase);
    if(!res){
      throw new Error('密码错误');
    }
  }
  static genToken(userName){
    /**
     * sign方法： 生成token
     * 参数1：payload，该参数是明文的，所以不要加入一些敏感数据，比如说password
     */
    const token = jwt.sign({
      userName: userName,
    }, baseConfig.jwt.secret, {
      expiresIn: 60 * baseConfig.jwt.expireTime, // JWTLoginConfig.expireTime表示分钟数
    });
    return token
  }
  static async createUser(body){
    await User.create({
      userName: body.userName,
      password: body.password,
    });
  }
}


module.exports = UserService;
