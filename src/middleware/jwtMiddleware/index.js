const KoaCompose = require('koa-compose');
const ErrorHandle = require('./ErrorHandle');
const koaJWT = require('./koaJWT');

module.exports = KoaCompose([ErrorHandle, koaJWT]);
