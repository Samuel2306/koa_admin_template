const resultCodesAndMessage = {
  'air_0000': '接口调用成功',
  'air_0001': '服务器错误',
  'air_0002': '请求参数缺失',

  /* 用户相关 */
  'air_0010': '该用户名已存在，不可重复注册',
  'air_0012': '用户登录失败，密码错误',
  'air_0013': '用户登录失败，用户不存在',
  'air_0014': '用户过期, 请重新登录',
  'air_0015': '用户token无效',
  /* 用户相关 */


  /* 字典相关 */
  'air_0020': '已存在相同名称或者编码的字典类型',
  'air_0021': '已存在相同名称或者编码的字典选项',
  'air_0022': 'categoryCode对应的字典类型不存在',
  /* 字典相关 */
}
class Result {
  constructor({code, data, msg}){
    this.code = code;
    this.data = data;
    this.message = msg ? msg : resultCodesAndMessage[code];
  }
}

class SuccessResult extends Result {
  constructor({data=null, msg}){
    super({
      code: 'air_0000',
      data,
      msg,
    })
  }
}

class ErrorResult extends Result {
  constructor({code='air_0001', data=null, msg}){
    super({
      code,
      data,
      msg,
    })
  }
}

module.exports = {
  SuccessResult,
  ErrorResult,
};


