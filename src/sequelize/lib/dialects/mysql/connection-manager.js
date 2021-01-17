'use strict';

const AbstractConnectionManager = require('../abstract/connection-manager');
const SequelizeErrors = require('../../errors');
const { logger } = require('../../utils/logger');
const DataTypes = require('../../data-types').mysql;
const momentTz = require('moment-timezone');
const debug = logger.debugContext('connection:mysql');
const parserStore = require('../parserStore')('mysql');
const { promisify } = require('util');

/**
 * MySQL Connection Manager
 *
 * Get connections, validate and disconnect them.
 * AbstractConnectionManager pooling use it to handle MySQL specific connections
 * Use https://github.com/sidorares/node-mysql2 to connect with MySQL server
 *
 * @private
 */
class ConnectionManager extends AbstractConnectionManager {
  constructor(dialect, sequelize) {
    // 设置端口号，mysql的默认端口号是3306
    sequelize.config.port = sequelize.config.port || 3306;
    super(dialect, sequelize);
    // 加载mysql2模块，mysql2模块是数据库驱动程序
    this.lib = this._loadDialectModule('mysql2');
    this.refreshTypeParser(DataTypes);
  }

  _refreshTypeParser(dataType) {
    parserStore.refresh(dataType);
  }

  _clearTypeParser() {
    parserStore.clear();
  }

  static _typecast(field, next) {
    if (parserStore.get(field.type)) {
      return parserStore.get(field.type)(field, this.sequelize.options, next);
    }
    return next();
  }

  /**
   * Connect with MySQL database based on config, Handle any errors in connection
   * Set the pool handlers on connection.error
   * Also set proper timezone once connection is connected.  // 一旦建立连接就会设置合适的时区
   *
   *
   * @param {object} config
   * @returns {Promise<Connection>}
   * @private
   */
  async connect(config) {
    const connectionConfig = {
      host: config.host,
      port: config.port,
      user: config.username,
      flags: '-FOUND_ROWS',
      password: config.password,
      database: config.database,
      timezone: this.sequelize.options.timezone,
      typeCast: ConnectionManager._typecast.bind(this),
      bigNumberStrings: false,
      supportBigNumbers: true,
      ...config.dialectOptions
    };

    try {
      const connection = await new Promise((resolve, reject) => {
        // 利用mysql2模块的createConnection创建与数据库的连接
        const connection = this.lib.createConnection(connectionConfig);

        const errorHandler = e => {
          // clean up connect & error event if there is error
          connection.removeListener('connect', connectHandler);
          connection.removeListener('error', connectHandler);
          reject(e);
        };

        const connectHandler = () => {
          // clean up error event if connected
          connection.removeListener('error', errorHandler);
          resolve(connection);
        };

        // don't use connection.once for error event handling here
        // mysql2 emit error two times in case handshake was failed
        // first error is protocol_lost and second is timeout
        // if we will use `once.error` node process will crash on 2nd error emit
        connection.on('error', errorHandler);
        connection.once('connect', connectHandler);
      });

      debug('connection acquired');
      // 默认的错误处理函数
      connection.on('error', error => {
        switch (error.code) {
          case 'ESOCKET':
          case 'ECONNRESET':
          case 'EPIPE':
          case 'PROTOCOL_CONNECTION_LOST':
            this.pool.destroy(connection);
        }
      });

      // 设置相应的时区
      if (!this.sequelize.config.keepDefaultTimezone) {
        // set timezone for this connection
        // but named timezone are not directly supported in mysql, so get its offset first
        let tzOffset = this.sequelize.options.timezone;
        tzOffset = /\//.test(tzOffset) ? momentTz.tz(tzOffset).format('Z') : tzOffset;
        await promisify(cb => connection.query(`SET time_zone = '${tzOffset}'`, cb))();
      }

      return connection;
    } catch (err) {
      // 根据不同的错误code，抛出特定的错误类型
      switch (err.code) {
        case 'ECONNREFUSED':
          throw new SequelizeErrors.ConnectionRefusedError(err);
        case 'ER_ACCESS_DENIED_ERROR':
          throw new SequelizeErrors.AccessDeniedError(err);
        case 'ENOTFOUND':
          throw new SequelizeErrors.HostNotFoundError(err);
        case 'EHOSTUNREACH':
          throw new SequelizeErrors.HostNotReachableError(err);
        case 'EINVAL':
          throw new SequelizeErrors.InvalidConnectionError(err);
        default:
          throw new SequelizeErrors.ConnectionError(err);
      }
    }
  }
  // 关闭与数据库的连接
  async disconnect(connection) {
    // Don't disconnect connections with CLOSED state
    if (connection._closing) {
      debug('connection tried to disconnect but was already at CLOSED state');
      return;
    }

    return await promisify(callback => connection.end(callback))();
  }

  validate(connection) {
    return connection
      && !connection._fatalError
      && !connection._protocolError
      && !connection._closing
      && !connection.stream.destroyed;
  }
}

module.exports = ConnectionManager;
module.exports.ConnectionManager = ConnectionManager;
module.exports.default = ConnectionManager;
