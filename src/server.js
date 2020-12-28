const Koa = require('koa');
const KoaCompose = require('koa-compose');
const routers = require('./router/index');
const middlewareQueue = require('./middleware');

module.exports = function(){
  const app = new Koa();


  // 加入所有中间件
  const compose = KoaCompose(middlewareQueue);
  app.use(compose);

  /* 将所有接口引入 */
  for (let prop in routers){
    let router = routers[prop];
    app.use(router.routes());
    app.use(router.allowedMethods())
  }
  app.listen(5000);
}
