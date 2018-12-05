/**
 * 这个是dev和prod环境都会去加载的东西
 */
'use strict';
const path = require('path');
const utils = require('./utils');
const config = require('../config');
const vueLoaderConfig = require('./vue-loader.conf');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  context: path.resolve(__dirname, '../'), // context是webpack编译时的基础目录，entry入口会相对于此目录查找

  entry: {
    app: './src/main.js'
  },

  output: {
    path: config.build.assetsRoot, // 打包后文件输出的目录
    filename: '[name].js', // name 为chunk name,即entry的key值

    // 正式发布环境下编译输出的上线路径的根路径
    // 如：publicPath: "http://cdn.example.com/
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
  },

  // 主要设置模块如何被解析
  resolve: {
    // 自动解析确定的拓展名,使导入模块时不带拓展名
    // import './test'
    extensions: ['.js', '.vue', '.json'], 

    // 创建import或require的别名
    alias: {
      vue$: 'vue/dist/vue.esm.js', // 精准匹配，import vue from 'vue';
      '@': resolve('src') // import test from '@/test.js'
    }
  },

  // 配置loader
  module: {
    rules: [
      // vue-loader,允许使用单文件组件
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig // options是对vue-loader做的额外选项配置
      },

      // 配置，.babelrc
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },

      // url-loader，允许 import 匹配的文件
      // 在文件大小（单位 byte）低于指定的限制时，可以返回一个 DataURL（base64）
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },

  // 这些选项可以配置是否 polyfill 或 mock 某些 Node.js 全局变量和模块。
  // 这可以使最初为 Node.js 环境编写的代码，在其他环境（如浏览器）中运行
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false, // 一个函数，类似 setTimeout

    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    // 阻止 mock 下列模块，因为对浏览器没什么用
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
};
