module.exports = async (ctx, next) => {
  ctx.session.count = ctx.session.count || 0
  ctx.session.count++; // count用来记录当前session中用户调用接口的次数
  await next()
}

