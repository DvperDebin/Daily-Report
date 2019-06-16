const path = require('path');

module.exports = {
    mode:'production',

    entry: {
        main: './src/index.js',
    },

    // webpack 只知道如何打包js 当遇到其他类型文件时，webpack 不知道如何打包 就会来module寻找打包方法
    module: {
      rules: [
          {
              test: /\.(jpg|png|gif)$/,  //当遇到以jpg,png,gif结尾的文件时
              use:{
                  loader: 'file-loader',  // 让webpack使用file-loader进行打包
                  options: {  // 额外配置项参数
                      // placeholder 占位符
                      name: '[name][hash].[ext]', // 新打包出来的图片名字就是  “原图片名hash值.原图片扩展名”
                      outputPath: 'images' // 打包 jpg,png,gif 文件放到dist/images下的文件夹中
                  }
              }
          }
      ]
    },

    output:{
        filename: 'bundle.js',
        path: path.resolve(__dirname,'dist'),
    }
};
