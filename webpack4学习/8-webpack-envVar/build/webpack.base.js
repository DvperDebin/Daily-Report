const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
// 从base.config中区别环境进行打包
const merge = require('webpack-merge');
const devConfig = require('./webpack.dev');
const prodConfig = require('./webpack.prod');

const baseConfig = {
    entry: {
        main: './src/index.js',
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: '[name][hash:7].[ext]',
                        limit: 2048,
                    }
                }
            },
            {
                test: /\.js$/,
                use: [
                    {
                        loader: "babel-loader",
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.(ttf|svg|eot)$/,
                use: {
                    loader: 'file-loader',
                }
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin(
            {
                template: './src/index.html'
            }
        ),
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({
            $: 'jQuery',
            _: 'lo dash'
        })
    ],
    output:{
        publicPath: '/',
        filename: '[name][hash:7].js',
        chunkFilename:'[name][hash:7].chunk.js',
        path: path.resolve(__dirname,'../dist'),
    },

    performance:false,

    optimization: {
        runtimeChunk:{
          name: 'runtime',
        },
        usedExports: true,

        splitChunks:{
            chunks: 'all',
            catchGroups:{
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    filename: '[hash:7][name].[ext]'
                },
                default: {
                    priority: -20,
                    reuseExistingChunk: true,
                    filename: '[hash:7][name].[ext]'
                }
            }
        },
    },
};

// 需要配合 package.json 中的 全局变量传参来使用 --env.production 相当于传进来的 env.production 为true
module.exports = (env) => {
    if (env && env.production) {
        return merge(baseConfig,prodConfig)
    }else {
        return merge(baseConfig,devConfig)
    }
};
