/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};
  //关闭安全认证
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    }
  }
  config.session = {
    key: 'SESSION_ID',  // 设置session cookie里面的key
    maxAge: 1000*60*30, // 设置过期时间
    httpOnly: true,
    encrypt: true,
    // renew: true         // renew等于true 那么每次刷新页面的时候 session都会被延期
  }
  //配置mysql数据库
  config.mysql = {
    client: {
      host: "localhost",
      user: "root",
      password: "root",
      port: 3306,
      database: "project"
    }
  }
  config.multipart = {
    mode: 'file'
  }
  config.cors = {
    // origin: 'http://192.168.2.82',
    origin: '*'
    // credentials: true
  }

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1600395715948_2483';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
