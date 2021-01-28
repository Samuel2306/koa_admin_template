'use strict';

var Promise = require('any-promise');
var util = require('util');
var format = util.format;

function TimeoutError(message, err) {
  Error.call(this);
  Error.captureStackTrace(this, TimeoutError);
  this.name = 'TimeoutError';
  this.message = message;
  this.previous = err;
}

util.inherits(TimeoutError, Error);
// 匹配错误的函数
function matches(match, err) {
  if (match === true) return true;
  if (typeof match === 'function') {
    try {
      if (err instanceof match) return true;
    } catch (_) {
      return !!match(err);
    }
  }
  if (match === err.toString()) return true;
  if (match === err.message) return true;
  return match instanceof RegExp
    && (match.test(err.message) || match.test(err.toString()));
}

/**
 * 自动重试方法
 * @param callback：每次重试的函数
 * @param options：重试的配置选项
 * @returns {Promise | Promise<any>}
 */
module.exports = function retryAsPromised(callback, options) {
  if (!callback || !options) {
    throw new Error(
      'retry-as-promised must be passed a callback and a options set or a number'
    );
  }

  if (typeof options === 'number') {
    options = {
      max: options
    };
  }

  // Super cheap clone
  options = {
    $current: options.$current || 1,  // 表示当前第几次尝试
    max: options.max, // 最大重试次数
    timeout: options.timeout || undefined, // 超时时间
    match: options.match || [], // 定义可重试的错误名称，不匹配就不会继续重试
    backoffBase: options.backoffBase === undefined ? 100 : options.backoffBase,  // 每次重试的间隔时间
    backoffExponent: options.backoffExponent || 1.1, // 用来增加每次重试的间隔时间
    report: options.report || function () {}, // 报告日志的方法
    // 当发生错误/报告信息时返回的名称
    name: options.name || callback.name || 'unknown'
  };

  if (!Array.isArray(options.match)) options.match = [options.match];
  // 每次尝试之前先上报一次日志
  options.report('Trying ' + options.name + ' #' + options.$current + ' at ' + new Date().toLocaleTimeString(), options);

  /**
   * 最终返回的是一个promise对象
   */
  return new Promise(function(resolve, reject) {
    let timeout,
        backoffTimeout,
        lastError;

    if (options.timeout) {
      timeout = setTimeout(function() {
        if (backoffTimeout) clearTimeout(backoffTimeout);
        reject(new TimeoutError(options.name + ' timed out', lastError));
      }, options.timeout);
    }

    Promise.resolve(callback({ current: options.$current }))
      .then(resolve)  // 把callback({ current: options.$current })的结果传给resolve方法并执行resolve方法
      .then(function() {
        if (timeout) clearTimeout(timeout);
        if (backoffTimeout) clearTimeout(backoffTimeout);
      })
      .catch(function(err) {
        // 失败发起重试
        if (timeout) clearTimeout(timeout);
        if (backoffTimeout) clearTimeout(backoffTimeout);

        lastError = err;
        options.report((err && err.toString()) || err, options);

        // Should not retry if max has been reached
        let shouldRetry = options.$current < options.max;
        if (!shouldRetry) {
          return reject(err);
        }
        // 如果定义了match，那只有发生了match里面指定的错误才会继续重试
        shouldRetry = options.match.length === 0 || options.match.some(function (match) {
          return matches(match, err)
        });
        if (!shouldRetry) return reject(err);

        // Math.pow(x,y) 返回 x 的 y 次幂的值
        let retryDelay = Math.pow(
          options.backoffBase,
          Math.pow(options.backoffExponent, options.$current - 1)
        );


        options.$current++;  // 记录重试次数
        options.report(format('Retrying %s (%s)', options.name, options.$current), options);

        if (retryDelay) {
          // Use backoff function to ease retry rate
          options.report(format('Delaying retry of %s by %s', options.name, retryDelay), options);
          backoffTimeout = setTimeout(function() {
            retryAsPromised(callback, options)
              .then(resolve)
              .catch(reject);
          }, retryDelay);
        } else {
          retryAsPromised(callback, options)
            .then(resolve)
            .catch(reject);
        }
      });
  });
};

module.exports.TimeoutError = TimeoutError;
