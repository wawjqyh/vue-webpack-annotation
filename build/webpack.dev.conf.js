'use strict';
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge'); // 合并 webpack 配置文件
const path = require('path');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin'); // 在webpack中拷贝文件和文件夹
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 打包 html
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin'); // 清理编译时的无用信息
const portfinder = require('portfinder'); // 自动检索下一个可用端口，当前设置的端口可能被占用

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

// 和基础配置合并
const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    // style loader,对一些独立的css文件以及它的预处理文件编译
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },

  // cheap-module-eval-source-map is faster for development
  // sourcemap
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  // webpack-dev-server 服务配置
  devServer: {
    clientLogLevel: 'warning', // console 控制台显示的消息，可能的值有 none, error, warning 或者 info

    // 路由使用 html5 history 时需要配置这个参数
    historyApiFallback: {
      rewrites: [{ from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') }]
    },
    hot: true, // 模块热更新
    contentBase: false, // since we use CopyWebpackPlugin. // 告诉服务器从哪里提供内容，静态文件需要指定，一般不会用到
    compress: true, // 启用gzip 压缩
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser, // 自动打开浏览器
    overlay: config.dev.errorOverlay ? { warnings: false, errors: true } : false, // 遮罩，显示错误信息
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable, // 代理设置
    quiet: true, // necessary for FriendlyErrorsPlugin // webpack 的错误或警告在控制台不可见

    // 启用 Watch 模式。这意味着在初始构建之后，webpack 将继续监听任何已解析文件的更改
    watchOptions: {
      // 通过传递 true 开启 polling，或者指定毫秒为单位进行轮询。默认为false
      poll: config.dev.poll
    }
  },

  plugins: [
    // 允许创建一个在编译时可以配置的全局常量，对开发模式和发布模式的构建允许不同的行为
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),

    // 模块热替换它允许在运行时更新各种模块，而无需进行完全刷新
    new webpack.HotModuleReplacementPlugin(),

    // 热加载时直接返回更新的文件名，而不是id
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.

    // 跳过编译时出错的代码并记录下来，主要作用是使编译后运行时的包不出错
    new webpack.NoEmitOnErrorsPlugin(),

    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),

    // copy custom static assets
    // 在webpack中拷贝文件和文件夹
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
});

module.exports = new Promise((resolve, reject) => {
  // 获取端口号
  portfinder.basePort = process.env.PORT || config.dev.port;
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err);
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port;
      // add port to devServer config
      devWebpackConfig.devServer.port = port;

      // Add FriendlyErrorsPlugin
      // 清理编译时的无用信息
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`]
          },

          // 桌面提醒，弹出系统提示消息
          onErrors: config.dev.notifyOnErrors ? utils.createNotifierCallback() : undefined
        })
      );

      resolve(devWebpackConfig);
    }
  });
});
