const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.config');
const compiler = webpack(config);
const app = express();

app.use(webpackDevMiddleware(compiler,{
    publicPath:config.output.publicPath
})); // 使用中间件

app.listen(8080, () => {
    console.log("success");
});
