'use strict';
require('./check-versions')();

// 设置当前环境为生产环境
process.env.NODE_ENV = 'production';

const ora = require('ora'); //loading...进度条
const rm = require('rimraf'); //删除文件 'rm -rf'
const path = require('path');
const chalk = require('chalk'); // 终端显示带颜色的文字
const webpack = require('webpack');
const config = require('../config');
const webpackConfig = require('./webpack.prod.conf');

// 在终端显示ora库的loading效果
const spinner = ora('building for production...');
spinner.start();

// 删除旧的编译文件
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err;

  // 执行 webpack
  webpack(webpackConfig, (err, stats) => {
    //停止loading
    spinner.stop();

    if (err) throw err;

    // 在编译完成的回调函数中,输出打包的信息
    process.stdout.write(
      stats.toString({
        colors: true,
        modules: false,
        children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
        chunks: false,
        chunkModules: false
      }) + '\n\n'
    );

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'));
      process.exit(1);
    }

    console.log(chalk.cyan('  Build complete.\n'));
    console.log(
      chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
          "  Opening index.html over file:// won't work.\n"
      )
    );
  });
});
