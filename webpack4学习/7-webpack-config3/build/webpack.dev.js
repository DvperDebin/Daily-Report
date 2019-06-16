const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const devConfig = {
    mode:'development',
    devtool: 'cheap-source-map',

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader','css-loader','postcss-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            modules: true,
                        }
                    }
                    ,'sass-loader','postcss-loader']
            },
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],

    devServer: {
        contentBase: './dist', // 监听
        open:true,
        port:8080,
        hot:true,
    }
};

// 通过merge 使基础配置 与 开发配置结合
module.exports = merge(baseConfig,devConfig);
