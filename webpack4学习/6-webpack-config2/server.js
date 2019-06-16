const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.config');
// 在node中使用webpack
const compiler = webpack(config);  // webpack 编译器， 利用webpack 结合config 随时可以进行编译

// 用express创建一个http服务器实例
const app = express();
app.use(webpackDevMiddleware(compiler,{  // 只要文件发生改变 compiler 就会重新运行
    publicPath:config.output.publicPath
})); // 使用中间件

app.listen(8080, () => {
    console.log("success");
});
