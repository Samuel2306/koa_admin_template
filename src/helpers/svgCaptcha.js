let svgCaptcha = require('svg-captcha');

let codeConfig = {
  size: 4,// 验证码长度
  ignoreChars: '0o1i', // 验证码字符中排除 0o1i
  noise: 2, // 干扰线条的数量
  // 宽度
  width: 80,
  // 高度
  height: 30,
  background: '#cc9966',
};

const createSvgCaptcha = function(){
  let captcha = svgCaptcha.create(codeConfig);
  return captcha;
};

module.exports = createSvgCaptcha;
