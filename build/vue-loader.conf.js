'use strict';
const utils = require('./utils');
const config = require('../config');
const isProduction = process.env.NODE_ENV === 'production'; // 判断当前环境
// 根据环境判断是否开启source map
const sourceMapEnabled = isProduction ? config.build.productionSourceMap : config.dev.cssSourceMap;

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isProduction // 是否提取为文件
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,

  // 转化请求的内容
  // <avatar :default-src="DEFAULT_AVATAR"></avatar>
  // DEFAULT_AVATAR = require('./assets/default-avatar.png')

  // 配置后可以简写
  // <avatar default-src="./assets/default-avatar.png"></avatar>
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
};
