const koaBodyMiddleware = require('./koaBodyMiddleware');
const corMiddleware = require('./corMiddleware');
const jwtMiddleware = require('./jwtMiddleware');
const sessionMiddleware = require('./sessionMiddleware');
const redisMiddleware = require('./redisMiddleware');

module.exports = [
  corMiddleware,
  koaBodyMiddleware,
  jwtMiddleware,
  // sessionMiddleware,
  // redisMiddleware,
];
