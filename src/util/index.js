const envConfig = require('../config/envConfig');

function getRequestBody(ctx){
  return ctx.request.body
}
function getRequestQuery(ctx){
  return ctx.request.query
}

function getReqBodyAndReqQuery(ctx){
  return {
    body: getRequestBody(ctx),
    query: getRequestQuery(ctx),
  }
}

function getEnvName(){
  return process.env.NODE_ENV || 'development'
}
function getRedisConfig(){
  return envConfig[getEnvName()].redis
}
function getMysqlConfig(){
  return envConfig[getEnvName()].mysql
}
function getAllowOriginsConfig(){
  return envConfig[getEnvName()].allowOrigins
}

module.exports = {
  getRequestBody: getRequestBody,
  getRequestQuery: getRequestQuery,
  getReqBodyAndReqQuery: getReqBodyAndReqQuery,
  getEnvName: getEnvName,
  getRedisConfig: getRedisConfig,
  getMysqlConfig: getMysqlConfig,
  getAllowOriginsConfig: getAllowOriginsConfig,
};
