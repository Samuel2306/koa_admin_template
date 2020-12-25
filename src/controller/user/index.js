const {
  UserService,
}  = require('../../service');
const {
  SuccessResult,
  ErrorResult,
} = require('../../helpers/result');
const {
  getRequestBody,
} = require('../../util');

class UserController {
  static async userLogin(ctx){
    const body = getRequestBody(ctx) || {};
    if(body.userName && body.password){
      let user = await UserService.findUserByUserName(body.userName);
      if(user){
        try{
          await UserService.checkPassword(body.password, user.password);
        }catch(e){
          // 用户登录失败，密码错误
          ctx.body = new ErrorResult({
            code: 'air_0012',
            data: null
          });
          return
        }
        let token = UserService.genToken(body.userName);
        ctx.body = new SuccessResult({
          data: 'Bearer ' + token,
          msg: "用户登录成功",
        });
      }else{
        // 用户登录失败，用户不存在
        ctx.body = new ErrorResult({
          code: 'air_0013',
          data: null
        });
      }
    }else{
      if (!body.userName) {
        // 用户参数缺失
        ctx.body = new ErrorResult({
          code: 'air_0002',
          data: null
        });
      } else {
        // 用户登录失败，密码错误
        ctx.body = new ErrorResult({
          code: 'air_0012',
          data: null
        });
      }
    }
  }
  static async registerUser(ctx){
    const body = getRequestBody(ctx) || {};
    if(body.userName && body.password){
      let user = await UserService.findUserByUserName(body.userName);
      if (user) {
        // 该用户名的用户已经存在，不可重复注册
        ctx.body = new ErrorResult({
          code: 'air_0010',
          data: null
        });
      } else {
        try {
          await UserService.createUser(body)
          ctx.body = new SuccessResult({
            data: null,
            msg: '用户注册成功',
          });
        } catch (e) {
          ctx.body = new ErrorResult({
            code: 'air_0001',
            data: null,
            msg: '用户注册失败',
          });
        }
      }
    }else{
      // 用户参数缺失
      ctx.body = new ErrorResult({
        code: 'air_0002',
        data: null,
      });
    }
  }
}

module.exports = UserController;
