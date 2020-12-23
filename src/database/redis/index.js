const util = require('../../util');
const redisConfig = util.getRedisConfig();
const redis = require('redis');

// 创建redis客户端
const redisClient = redis.createClient(redisConfig.port, redisConfig.host);

/**
 * 设置缓存
 * @param key
 * @param value
 * @param timeout: 超时时间，以秒为单位
 */
function set(key, value, timeout = 60 * 60) {
  if (typeof value === 'object' && value !== null) {
    value = JSON.stringify(value);
  }
  redisClient.set(key, value);
  redisClient.expire(key, timeout);
}


/**
 * 根据key获取相应的值
 * @param {string} key
 * @return {Promise} 返回一个promise对象
 */
function get(key){
  return new Promise((resolve, reject)=>{
    redisClient.get(key,(err,val)=>{
      if (err) {
        reject(err);
        return
      }
      try {
        resolve(
          JSON.parse(val)
        );
      } catch (error) {
        resolve(val);
      }
    })
  })
}
