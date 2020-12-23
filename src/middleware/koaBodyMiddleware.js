const koaBody = require('koa-body');

module.exports = koaBody({
  // 支持文件格式
  multipart: true,
  encoding:'utf-8',
})
